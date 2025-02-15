import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskTable1739627137543 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "user" (
            id serial NOT NULL,
            username varchar(256) NOT NULL,
            password_hash varchar(256) NOT NULL,
            CONSTRAINT user_pk PRIMARY KEY (id),
            CONSTRAINT user_unique_username UNIQUE (username)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "user";`);
  }
}
