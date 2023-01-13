import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1673597293227 implements MigrationInterface {
  name = 'migration1673597293227'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."reminders_status_enum" RENAME TO "reminders_status_enum_old"`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."reminders_status_enum" AS ENUM('open', 'fired', 'revoked')`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."reminders_status_enum_temp" AS ENUM('open', 'fired', 'revoked', 'created')`
    )
    await queryRunner.query(
      `ALTER TABLE "reminders" ALTER COLUMN "status" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "reminders" ALTER COLUMN "status" TYPE "public"."reminders_status_enum_temp" USING "status"::"text"::"public"."reminders_status_enum_temp"`
    )
    await queryRunner.query(
      `UPDATE "reminders" SET "status" = 'open' WHERE "status" = 'created'`
    )
    await queryRunner.query(
      `ALTER TABLE "reminders" ALTER COLUMN "status" TYPE "public"."reminders_status_enum" USING "status"::"text"::"public"."reminders_status_enum"`
    )
    await queryRunner.query(
      `ALTER TABLE "reminders" ALTER COLUMN "status" SET DEFAULT 'open'`
    )
    await queryRunner.query(`DROP TYPE "public"."reminders_status_enum_old"`)
    await queryRunner.query(`DROP TYPE "public"."reminders_status_enum_temp"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."reminders_status_enum_old" AS ENUM('created', 'fired', 'revoked')`
    )
    await queryRunner.query(
      `ALTER TABLE "reminders" ALTER COLUMN "status" DROP DEFAULT`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."reminders_status_enum_temp" AS ENUM('open', 'fired', 'revoked', 'created')`
    )
    await queryRunner.query(
      `ALTER TABLE "reminders" ALTER COLUMN "status" TYPE "public"."reminders_status_enum_temp" USING "status"::"text"::"public"."reminders_status_enum_temp"`
    )
    await queryRunner.query(
      `UPDATE "reminders" SET "status" = 'created' WHERE "status" = 'open'`
    )
    await queryRunner.query(
      `ALTER TABLE "reminders" ALTER COLUMN "status" TYPE "public"."reminders_status_enum_old" USING "status"::"text"::"public"."reminders_status_enum_old"`
    )
    await queryRunner.query(
      `ALTER TABLE "reminders" ALTER COLUMN "status" SET DEFAULT 'created'`
    )
    await queryRunner.query(`DROP TYPE "public"."reminders_status_enum"`)
    await queryRunner.query(`DROP TYPE "public"."reminders_status_enum_temp"`)
    await queryRunner.query(
      `ALTER TYPE "public"."reminders_status_enum_old" RENAME TO "reminders_status_enum"`
    )
  }
}
