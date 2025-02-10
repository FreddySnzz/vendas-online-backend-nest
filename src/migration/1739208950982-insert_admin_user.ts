import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertAdminUser1739208950982 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            INSERT INTO public."user"(
                name, email, cpf, type_user, phone, password)
                VALUES ('root', 'admin@root.com', '00000000001', 2, '55900000000', '$2b$10$Z5O8SkC5P0ImHOZM8zUBQ.yVM3VnpbZTx5Yuz27rN2mEUljdI7ZR2');
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            DELETE FROM public."user"
                WHERE email like 'admin@root.com';
        `)
    }

}
