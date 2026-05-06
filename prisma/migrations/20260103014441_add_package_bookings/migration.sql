-- CreateTable
CREATE TABLE `package_bookings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reference` VARCHAR(50) NOT NULL,
    `package_id` INTEGER NOT NULL,
    `event_type` VARCHAR(100) NOT NULL,
    `event_date` DATE NOT NULL,
    `start_time` VARCHAR(20) NOT NULL,
    `duration` VARCHAR(50) NOT NULL,
    `guests` INTEGER NULL DEFAULT 1,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) NOT NULL,
    `organization` VARCHAR(255) NULL,
    `message` TEXT NULL,
    `total_amount` DECIMAL(10, 2) NOT NULL,
    `payment_method` VARCHAR(50) NOT NULL,
    `payment_status` VARCHAR(20) NOT NULL DEFAULT 'pending',
    `staff_member` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `package_bookings_reference_key`(`reference`),
    INDEX `package_bookings_package_id_idx`(`package_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `package_booking_addons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `booking_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `unit` VARCHAR(50) NULL,

    INDEX `package_booking_addons_booking_id_idx`(`booking_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `package_bookings` ADD CONSTRAINT `package_bookings_package_id_fkey` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `package_booking_addons` ADD CONSTRAINT `package_booking_addons_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `package_bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
