-- CreateTable
CREATE TABLE `halls` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `capacity` VARCHAR(100) NOT NULL,
    `price` VARCHAR(100) NOT NULL,
    `duration` VARCHAR(100) NOT NULL,
    `main_image_path` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `contact_email` VARCHAR(255) NULL,
    `contact_image_path` VARCHAR(255) NULL,
    `contact_name` VARCHAR(255) NULL,
    `contact_phone` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hall_addons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hall_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `price` VARCHAR(100) NOT NULL,
    `unit` VARCHAR(100) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_hall_addons_hall_id`(`hall_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hall_gallery_videos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hall_id` INTEGER NOT NULL,
    `video_path` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_hall_gallery_videos_hall_id`(`hall_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hall_gallery_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hall_id` INTEGER NOT NULL,
    `image_path` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_hall_gallery_hall_id`(`hall_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hall_amenities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hall_id` INTEGER NOT NULL,
    `amenity_name` VARCHAR(255) NOT NULL,

    INDEX `idx_hall_amenities_hall_id`(`hall_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hall_suitability` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hall_id` INTEGER NOT NULL,
    `event_type` VARCHAR(255) NOT NULL,

    INDEX `idx_hall_suitability_hall_id`(`hall_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hostels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `capacity` VARCHAR(100) NOT NULL,
    `price` VARCHAR(100) NOT NULL,
    `duration` VARCHAR(100) NOT NULL,
    `main_image_path` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `contact_email` VARCHAR(255) NULL,
    `contact_image_path` VARCHAR(255) NULL,
    `contact_name` VARCHAR(255) NULL,
    `contact_phone` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hostel_gallery_videos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hostel_id` INTEGER NOT NULL,
    `video_path` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_hostel_gallery_videos_hostel_id`(`hostel_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hostel_gallery_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hostel_id` INTEGER NOT NULL,
    `image_path` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_hostel_gallery_hostel_id`(`hostel_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hostel_amenities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hostel_id` INTEGER NOT NULL,
    `amenity_name` VARCHAR(255) NOT NULL,

    INDEX `idx_hostel_amenities_hostel_id`(`hostel_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hostel_suitability` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hostel_id` INTEGER NOT NULL,
    `event_type` VARCHAR(255) NOT NULL,

    INDEX `idx_hostel_suitability_hostel_id`(`hostel_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hostel_addons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hostel_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `price` VARCHAR(100) NOT NULL,
    `unit` VARCHAR(100) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_hostel_addons_hostel_id`(`hostel_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `packages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `capacity` VARCHAR(100) NOT NULL,
    `price` VARCHAR(100) NOT NULL,
    `duration` VARCHAR(100) NOT NULL,
    `main_image_path` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `contact_email` VARCHAR(255) NULL,
    `contact_image_path` VARCHAR(255) NULL,
    `contact_name` VARCHAR(255) NULL,
    `contact_phone` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `package_gallery_videos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `package_id` INTEGER NOT NULL,
    `video_path` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_package_gallery_videos_package_id`(`package_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `package_gallery_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `package_id` INTEGER NOT NULL,
    `image_path` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_package_gallery_images_package_id`(`package_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `package_features` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `package_id` INTEGER NOT NULL,
    `feature_name` VARCHAR(255) NOT NULL,

    INDEX `idx_package_features_package_id`(`package_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `package_suitability` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `package_id` INTEGER NOT NULL,
    `event_type` VARCHAR(255) NOT NULL,

    INDEX `idx_package_suitability_package_id`(`package_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `package_addons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `package_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `price` VARCHAR(100) NOT NULL,
    `unit` VARCHAR(100) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_package_addons_package_id`(`package_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hall_bookings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reference` VARCHAR(50) NOT NULL,
    `event_type` VARCHAR(100) NOT NULL,
    `event_date` DATE NOT NULL,
    `start_time` VARCHAR(20) NOT NULL,
    `duration` VARCHAR(50) NOT NULL,
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

    UNIQUE INDEX `hall_bookings_reference_key`(`reference`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booked_halls` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `booking_id` INTEGER NOT NULL,
    `hall_id` INTEGER NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,

    INDEX `booked_halls_booking_id_idx`(`booking_id`),
    INDEX `booked_halls_hall_id_idx`(`hall_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hall_booking_addons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `booked_hall_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `unit` VARCHAR(50) NULL,

    INDEX `hall_booking_addons_booked_hall_id_idx`(`booked_hall_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hostel_bookings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reference` VARCHAR(50) NOT NULL,
    `hostel_id` INTEGER NOT NULL,
    `check_in_date` DATE NOT NULL,
    `check_in_time` VARCHAR(20) NULL,
    `duration` VARCHAR(50) NOT NULL,
    `guests` INTEGER NOT NULL DEFAULT 1,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) NOT NULL,
    `institution` VARCHAR(255) NULL,
    `special_requests` TEXT NULL,
    `total_amount` DECIMAL(10, 2) NOT NULL,
    `payment_method` VARCHAR(50) NOT NULL,
    `payment_status` VARCHAR(20) NOT NULL DEFAULT 'pending',
    `staff_member` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `hostel_bookings_reference_key`(`reference`),
    INDEX `hostel_bookings_hostel_id_idx`(`hostel_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hostel_booking_addons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `booking_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `unit` VARCHAR(50) NULL,

    INDEX `hostel_booking_addons_booking_id_idx`(`booking_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admins_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `google_id` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NULL,
    `phone_number` VARCHAR(50) NULL,
    `profile_picture` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `clients_google_id_key`(`google_id`),
    UNIQUE INDEX `clients_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `hall_addons` ADD CONSTRAINT `hall_addons_ibfk_1` FOREIGN KEY (`hall_id`) REFERENCES `halls`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `hall_gallery_videos` ADD CONSTRAINT `hall_gallery_videos_ibfk_1` FOREIGN KEY (`hall_id`) REFERENCES `halls`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `hall_gallery_images` ADD CONSTRAINT `hall_gallery_images_ibfk_1` FOREIGN KEY (`hall_id`) REFERENCES `halls`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `hall_amenities` ADD CONSTRAINT `hall_amenities_ibfk_1` FOREIGN KEY (`hall_id`) REFERENCES `halls`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `hall_suitability` ADD CONSTRAINT `hall_suitability_ibfk_1` FOREIGN KEY (`hall_id`) REFERENCES `halls`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `hostel_gallery_videos` ADD CONSTRAINT `hostel_gallery_videos_ibfk_1` FOREIGN KEY (`hostel_id`) REFERENCES `hostels`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `hostel_gallery_images` ADD CONSTRAINT `hostel_gallery_images_ibfk_1` FOREIGN KEY (`hostel_id`) REFERENCES `hostels`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `hostel_amenities` ADD CONSTRAINT `hostel_amenities_ibfk_1` FOREIGN KEY (`hostel_id`) REFERENCES `hostels`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `hostel_suitability` ADD CONSTRAINT `hostel_suitability_ibfk_1` FOREIGN KEY (`hostel_id`) REFERENCES `hostels`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `hostel_addons` ADD CONSTRAINT `hostel_addons_ibfk_1` FOREIGN KEY (`hostel_id`) REFERENCES `hostels`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `package_gallery_videos` ADD CONSTRAINT `package_gallery_videos_ibfk_1` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `package_gallery_images` ADD CONSTRAINT `package_gallery_images_ibfk_1` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `package_features` ADD CONSTRAINT `package_features_ibfk_1` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `package_suitability` ADD CONSTRAINT `package_suitability_ibfk_1` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `package_addons` ADD CONSTRAINT `package_addons_ibfk_1` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `booked_halls` ADD CONSTRAINT `booked_halls_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `hall_bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booked_halls` ADD CONSTRAINT `booked_halls_hall_id_fkey` FOREIGN KEY (`hall_id`) REFERENCES `halls`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hall_booking_addons` ADD CONSTRAINT `hall_booking_addons_booked_hall_id_fkey` FOREIGN KEY (`booked_hall_id`) REFERENCES `booked_halls`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hostel_bookings` ADD CONSTRAINT `hostel_bookings_hostel_id_fkey` FOREIGN KEY (`hostel_id`) REFERENCES `hostels`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hostel_booking_addons` ADD CONSTRAINT `hostel_booking_addons_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `hostel_bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
