import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";

import { AuthService } from "../auth.service";
import { UserService } from "../../user/user.service";
import { userEntityMock } from "../../user/__mocks__/user.mock";
import { jwtMock } from "../__mocks__/jwt.mock";
import { loginUserMock } from "../__mocks__/login-user.mock";
import { ReturnUserDto } from "../../user/dtos/returnUser.dto";

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findUserByEmail: jest.fn().mockResolvedValue(userEntityMock),
          }
        },
        {
          provide: JwtService,
          useValue: {
            sign: () => jwtMock,
          }
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should return user if email and password are valid', async () => {
    const user = await service.login(loginUserMock);

    expect(user).toEqual({
      accessToken: jwtMock,
      user: new ReturnUserDto(userEntityMock)
    });
  });

  it('should return error in UserService', async () => {
    jest.spyOn(userService, 'findUserByEmail').mockRejectedValueOnce(undefined);

    expect(service.login(loginUserMock)).rejects.toThrow();
  });

  it('should return user if email not exist', async () => {
    jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(undefined);

    expect(service.login(loginUserMock)).rejects.toThrow();
  });

  it('should return user if email are valid and password are invalid', async () => {
    expect(
      service.login({ ...loginUserMock, password: 'asdf'})
    ).rejects.toThrow();
  });
});