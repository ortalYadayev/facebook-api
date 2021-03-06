import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAndUrlTokenTables1629053230323 implements MigrationInterface {
  name = 'UserAndUrlTokenTables1629053230323';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`firstName\` varchar(255) NOT NULL,
                \`lastName\` varchar(255) NOT NULL,
                \`email\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`verifiedAt\` datetime NULL,
                UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`url_tokens\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`type\` varchar(255) NOT NULL,
                \`token\` varchar(255) NOT NULL,
                \`expiresIn\` datetime NULL,
                \`userId\` int NOT NULL,
                UNIQUE INDEX \`IDX_a2822d37fa5c0456c6f1a82ff8\` (\`token\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`url_tokens\`
            ADD CONSTRAINT \`FK_2d85a0e769ad0d87b4d1e78ebf0\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`url_tokens\` DROP FOREIGN KEY \`FK_2d85a0e769ad0d87b4d1e78ebf0\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_a2822d37fa5c0456c6f1a82ff8\` ON \`url_tokens\`
        `);
    await queryRunner.query(`
            DROP TABLE \`url_tokens\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\`
        `);
    await queryRunner.query(`
            DROP TABLE \`users\`
        `);
  }
}
