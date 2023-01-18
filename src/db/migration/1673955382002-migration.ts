import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1673955382002 implements MigrationInterface {
    name = 'migration1673955382002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commands" ADD "disabled" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commands" DROP COLUMN "disabled"`);
    }

}
