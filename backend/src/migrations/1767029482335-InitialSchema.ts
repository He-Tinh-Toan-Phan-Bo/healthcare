import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1767029482335 implements MigrationInterface {
    name = 'InitialSchema1767029482335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`doctors\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(36) NULL, \`clinic_id\` varchar(36) NOT NULL, \`specialty_id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`qualifications\` json NULL, \`experience\` int NOT NULL DEFAULT '0', \`avatar\` varchar(500) NULL, \`bio\` text NULL, \`is_available\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`specialties\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`icon\` varchar(100) NULL, \`slug\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_565f38f8b0417c7dbd40e42978\` (\`name\`), UNIQUE INDEX \`IDX_6678765a8dcfa5597a6cdf71eb\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`health_packages\` (\`id\` varchar(36) NOT NULL, \`clinic_id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`price\` decimal(12,2) NOT NULL, \`currency\` varchar(10) NOT NULL DEFAULT 'VND', \`category\` enum ('basic', 'comprehensive', 'premium') NOT NULL, \`features\` json NOT NULL, \`is_popular\` tinyint NOT NULL DEFAULT 0, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reviews\` (\`id\` varchar(36) NOT NULL, \`clinic_id\` varchar(36) NOT NULL, \`user_id\` varchar(36) NOT NULL, \`booking_id\` varchar(36) NULL, \`rating\` int NOT NULL, \`comment\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`time_slots\` (\`id\` varchar(36) NOT NULL, \`clinic_id\` varchar(36) NOT NULL, \`date\` date NOT NULL, \`start_time\` time NOT NULL, \`end_time\` time NOT NULL, \`is_available\` tinyint NOT NULL DEFAULT 1, \`max_bookings\` int NOT NULL DEFAULT '1', \`current_bookings\` int NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`clinics\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`address\` varchar(500) NOT NULL, \`phone\` varchar(20) NULL, \`email\` varchar(255) NULL, \`website\` varchar(255) NULL, \`rating\` decimal(2,1) NOT NULL DEFAULT '0.0', \`review_count\` int NOT NULL DEFAULT '0', \`image\` varchar(500) NULL, \`is_open\` tinyint NOT NULL DEFAULT 1, \`opening_hours\` varchar(255) NULL, \`latitude\` decimal(10,8) NULL, \`longitude\` decimal(11,8) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`services\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`icon\` varchar(100) NULL, \`category\` varchar(100) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`bookings\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(36) NOT NULL, \`clinic_id\` varchar(36) NOT NULL, \`package_id\` varchar(36) NULL, \`service_id\` varchar(36) NULL, \`time_slot_id\` varchar(36) NULL, \`patient_name\` varchar(255) NOT NULL, \`patient_email\` varchar(255) NOT NULL, \`patient_phone\` varchar(20) NOT NULL, \`patient_dob\` date NULL, \`patient_gender\` enum ('male', 'female', 'other') NULL, \`notes\` text NULL, \`booking_date\` date NOT NULL, \`booking_time\` time NOT NULL, \`status\` enum ('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending', \`cancellation_reason\` text NULL, \`cancelled_at\` timestamp NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notifications\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`message\` text NOT NULL, \`type\` enum ('booking', 'reminder', 'promotion', 'system') NOT NULL, \`is_read\` tinyint NOT NULL DEFAULT 0, \`related_entity_type\` varchar(50) NULL, \`related_entity_id\` varchar(36) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`read_at\` timestamp NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(20) NULL, \`avatar\` varchar(500) NULL, \`role\` enum ('patient', 'doctor', 'admin') NOT NULL DEFAULT 'patient', \`password\` varchar(255) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`email_verified\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`last_login_at\` timestamp NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`type\` enum ('article', 'service') NOT NULL, \`description\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`articles\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(500) NOT NULL, \`slug\` varchar(500) NOT NULL, \`excerpt\` text NOT NULL, \`content\` longtext NOT NULL, \`image\` varchar(500) NULL, \`category_id\` varchar(36) NULL, \`author_id\` varchar(36) NULL, \`read_time\` varchar(50) NULL, \`published_at\` timestamp NULL, \`tags\` json NULL, \`view_count\` int NOT NULL DEFAULT '0', \`is_featured\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_1123ff6815c5b8fec0ba9fec37\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`working_schedules\` (\`id\` varchar(36) NOT NULL, \`doctor_id\` varchar(36) NOT NULL, \`clinic_id\` varchar(36) NOT NULL, \`day_of_week\` int NOT NULL, \`start_time\` time NOT NULL, \`end_time\` time NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`clinic_specialties\` (\`clinic_id\` varchar(36) NOT NULL, \`specialty_id\` varchar(36) NOT NULL, INDEX \`IDX_9f37cff9b33b2a37a2db2a4c57\` (\`clinic_id\`), INDEX \`IDX_a69c0ac95d590803c4a3992645\` (\`specialty_id\`), PRIMARY KEY (\`clinic_id\`, \`specialty_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`doctors\` ADD CONSTRAINT \`FK_653c27d1b10652eb0c7bbbc4427\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`doctors\` ADD CONSTRAINT \`FK_c777ddd1e5b29c6ab02f86e794c\` FOREIGN KEY (\`clinic_id\`) REFERENCES \`clinics\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`doctors\` ADD CONSTRAINT \`FK_67d7cd9e927b1dca13d42511c02\` FOREIGN KEY (\`specialty_id\`) REFERENCES \`specialties\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`health_packages\` ADD CONSTRAINT \`FK_06d7c716d401d544b356d04295b\` FOREIGN KEY (\`clinic_id\`) REFERENCES \`clinics\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_c443aef2b47f32cb297b279cfcf\` FOREIGN KEY (\`clinic_id\`) REFERENCES \`clinics\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_728447781a30bc3fcfe5c2f1cdf\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_bbd6ac6e3e6a8f8c6e0e8692d63\` FOREIGN KEY (\`booking_id\`) REFERENCES \`bookings\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`time_slots\` ADD CONSTRAINT \`FK_e08cc37f0975049d07d35e7ddd6\` FOREIGN KEY (\`clinic_id\`) REFERENCES \`clinics\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_64cd97487c5c42806458ab5520c\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_bc1baa799d9f81ed178966d095b\` FOREIGN KEY (\`clinic_id\`) REFERENCES \`clinics\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_402873fd6596d556781ac5d8ae4\` FOREIGN KEY (\`package_id\`) REFERENCES \`health_packages\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_df22e2beaabc33a432b4f65e3c2\` FOREIGN KEY (\`service_id\`) REFERENCES \`services\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_172cb63c6e1dc9145098ef43714\` FOREIGN KEY (\`time_slot_id\`) REFERENCES \`time_slots\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_9a8a82462cab47c73d25f49261f\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD CONSTRAINT \`FK_e025eeefcdb2a269c42484ee43f\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD CONSTRAINT \`FK_6515da4dff8db423ce4eb841490\` FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`working_schedules\` ADD CONSTRAINT \`FK_9b78fcd1b68a41ff0d5bea7744b\` FOREIGN KEY (\`doctor_id\`) REFERENCES \`doctors\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`working_schedules\` ADD CONSTRAINT \`FK_a750ca3e040ff370e81e07f36df\` FOREIGN KEY (\`clinic_id\`) REFERENCES \`clinics\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`clinic_specialties\` ADD CONSTRAINT \`FK_9f37cff9b33b2a37a2db2a4c576\` FOREIGN KEY (\`clinic_id\`) REFERENCES \`clinics\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`clinic_specialties\` ADD CONSTRAINT \`FK_a69c0ac95d590803c4a39926452\` FOREIGN KEY (\`specialty_id\`) REFERENCES \`specialties\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`clinic_specialties\` DROP FOREIGN KEY \`FK_a69c0ac95d590803c4a39926452\``);
        await queryRunner.query(`ALTER TABLE \`clinic_specialties\` DROP FOREIGN KEY \`FK_9f37cff9b33b2a37a2db2a4c576\``);
        await queryRunner.query(`ALTER TABLE \`working_schedules\` DROP FOREIGN KEY \`FK_a750ca3e040ff370e81e07f36df\``);
        await queryRunner.query(`ALTER TABLE \`working_schedules\` DROP FOREIGN KEY \`FK_9b78fcd1b68a41ff0d5bea7744b\``);
        await queryRunner.query(`ALTER TABLE \`articles\` DROP FOREIGN KEY \`FK_6515da4dff8db423ce4eb841490\``);
        await queryRunner.query(`ALTER TABLE \`articles\` DROP FOREIGN KEY \`FK_e025eeefcdb2a269c42484ee43f\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_9a8a82462cab47c73d25f49261f\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_172cb63c6e1dc9145098ef43714\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_df22e2beaabc33a432b4f65e3c2\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_402873fd6596d556781ac5d8ae4\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_bc1baa799d9f81ed178966d095b\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_64cd97487c5c42806458ab5520c\``);
        await queryRunner.query(`ALTER TABLE \`time_slots\` DROP FOREIGN KEY \`FK_e08cc37f0975049d07d35e7ddd6\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_bbd6ac6e3e6a8f8c6e0e8692d63\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_728447781a30bc3fcfe5c2f1cdf\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_c443aef2b47f32cb297b279cfcf\``);
        await queryRunner.query(`ALTER TABLE \`health_packages\` DROP FOREIGN KEY \`FK_06d7c716d401d544b356d04295b\``);
        await queryRunner.query(`ALTER TABLE \`doctors\` DROP FOREIGN KEY \`FK_67d7cd9e927b1dca13d42511c02\``);
        await queryRunner.query(`ALTER TABLE \`doctors\` DROP FOREIGN KEY \`FK_c777ddd1e5b29c6ab02f86e794c\``);
        await queryRunner.query(`ALTER TABLE \`doctors\` DROP FOREIGN KEY \`FK_653c27d1b10652eb0c7bbbc4427\``);
        await queryRunner.query(`DROP INDEX \`IDX_a69c0ac95d590803c4a3992645\` ON \`clinic_specialties\``);
        await queryRunner.query(`DROP INDEX \`IDX_9f37cff9b33b2a37a2db2a4c57\` ON \`clinic_specialties\``);
        await queryRunner.query(`DROP TABLE \`clinic_specialties\``);
        await queryRunner.query(`DROP TABLE \`working_schedules\``);
        await queryRunner.query(`DROP INDEX \`IDX_1123ff6815c5b8fec0ba9fec37\` ON \`articles\``);
        await queryRunner.query(`DROP TABLE \`articles\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`notifications\``);
        await queryRunner.query(`DROP TABLE \`bookings\``);
        await queryRunner.query(`DROP TABLE \`services\``);
        await queryRunner.query(`DROP TABLE \`clinics\``);
        await queryRunner.query(`DROP TABLE \`time_slots\``);
        await queryRunner.query(`DROP TABLE \`reviews\``);
        await queryRunner.query(`DROP TABLE \`health_packages\``);
        await queryRunner.query(`DROP INDEX \`IDX_6678765a8dcfa5597a6cdf71eb\` ON \`specialties\``);
        await queryRunner.query(`DROP INDEX \`IDX_565f38f8b0417c7dbd40e42978\` ON \`specialties\``);
        await queryRunner.query(`DROP TABLE \`specialties\``);
        await queryRunner.query(`DROP TABLE \`doctors\``);
    }

}
