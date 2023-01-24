import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1674552173981 implements MigrationInterface {
    name = 'migration1674552173981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reminders" ADD "scheduledAt" bigint`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reminders" DROP COLUMN "scheduledAt"`);
    }

}
