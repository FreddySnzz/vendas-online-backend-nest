import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import { authorizationToLoginPayload } from "../utils/base-64-converter";

export const UserId = createParamDecorator((_, ctx: ExecutionContext) => {
  const { authorization } = ctx.switchToHttp().getRequest().headers;

  const token = authorization?.startsWith("Bearer ")
    ? authorization.split(" ")[1]
    : undefined;

  if (!token) return undefined;

  const loginPayload = authorizationToLoginPayload(token);
  return loginPayload?.id;
});
