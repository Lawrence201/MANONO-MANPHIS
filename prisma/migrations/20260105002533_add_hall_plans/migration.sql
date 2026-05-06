-- AlterTable
ALTER TABLE `hall_bookings` ADD COLUMN `event_name` VARCHAR(255) NULL,
    ADD COLUMN `payment_intent_id` VARCHAR(255) NULL,
    ADD COLUMN `receipt_path` VARCHAR(500) NULL;

-- CreateTable
CREATE TABLE `hall_plans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hall_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NULL,
    `price` VARCHAR(50) NOT NULL,
    `validity` VARCHAR(100) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_hall_plans_hall_id`(`hall_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hall_plan_features` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `plan_id` INTEGER NOT NULL,
    `feature_text` VARCHAR(255) NOT NULL,

    INDEX `idx_hall_plan_features_plan_id`(`plan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `hall_plans` ADD CONSTRAINT `hall_plans_ibfk_1` FOREIGN KEY (`hall_id`) REFERENCES `halls`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `hall_plan_features` ADD CONSTRAINT `hall_plan_features_ibfk_1` FOREIGN KEY (`plan_id`) REFERENCES `hall_plans`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
