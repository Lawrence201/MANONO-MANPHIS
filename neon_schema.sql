-- CreateTable
CREATE TABLE "halls" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "capacity" VARCHAR(100) NOT NULL,
    "price" VARCHAR(100) NOT NULL,
    "duration" VARCHAR(100) NOT NULL,
    "main_image_path" VARCHAR(255),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contact_email" VARCHAR(255),
    "contact_image_path" VARCHAR(255),
    "contact_name" VARCHAR(255),
    "contact_phone" VARCHAR(100),

    CONSTRAINT "halls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hall_addons" (
    "id" SERIAL NOT NULL,
    "hall_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" VARCHAR(100) NOT NULL,
    "unit" VARCHAR(100),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hall_addons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hall_plans" (
    "id" SERIAL NOT NULL,
    "hall_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "price" VARCHAR(50) NOT NULL,
    "validity" VARCHAR(100),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hall_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hall_plan_features" (
    "id" SERIAL NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "feature_text" VARCHAR(255) NOT NULL,

    CONSTRAINT "hall_plan_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hall_gallery_videos" (
    "id" SERIAL NOT NULL,
    "hall_id" INTEGER NOT NULL,
    "video_path" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hall_gallery_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hall_gallery_images" (
    "id" SERIAL NOT NULL,
    "hall_id" INTEGER NOT NULL,
    "image_path" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hall_gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hall_amenities" (
    "id" SERIAL NOT NULL,
    "hall_id" INTEGER NOT NULL,
    "amenity_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "hall_amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hall_suitability" (
    "id" SERIAL NOT NULL,
    "hall_id" INTEGER NOT NULL,
    "event_type" VARCHAR(255) NOT NULL,

    CONSTRAINT "hall_suitability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hostels" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "capacity" VARCHAR(100) NOT NULL,
    "price" VARCHAR(100) NOT NULL,
    "duration" VARCHAR(100) NOT NULL,
    "main_image_path" VARCHAR(255),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contact_email" VARCHAR(255),
    "contact_image_path" VARCHAR(255),
    "contact_name" VARCHAR(255),
    "contact_phone" VARCHAR(100),

    CONSTRAINT "hostels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hostel_gallery_videos" (
    "id" SERIAL NOT NULL,
    "hostel_id" INTEGER NOT NULL,
    "video_path" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hostel_gallery_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hostel_gallery_images" (
    "id" SERIAL NOT NULL,
    "hostel_id" INTEGER NOT NULL,
    "image_path" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hostel_gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hostel_amenities" (
    "id" SERIAL NOT NULL,
    "hostel_id" INTEGER NOT NULL,
    "amenity_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "hostel_amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hostel_suitability" (
    "id" SERIAL NOT NULL,
    "hostel_id" INTEGER NOT NULL,
    "event_type" VARCHAR(255) NOT NULL,

    CONSTRAINT "hostel_suitability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hostel_addons" (
    "id" SERIAL NOT NULL,
    "hostel_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" VARCHAR(100) NOT NULL,
    "unit" VARCHAR(100),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hostel_addons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "capacity" VARCHAR(100) NOT NULL,
    "price" VARCHAR(100) NOT NULL,
    "duration" VARCHAR(100) NOT NULL,
    "main_image_path" VARCHAR(255),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contact_email" VARCHAR(255),
    "contact_image_path" VARCHAR(255),
    "contact_name" VARCHAR(255),
    "contact_phone" VARCHAR(100),

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_bookings" (
    "id" SERIAL NOT NULL,
    "reference" VARCHAR(50) NOT NULL,
    "package_id" INTEGER NOT NULL,
    "event_type" VARCHAR(100) NOT NULL,
    "event_date" DATE NOT NULL,
    "start_time" VARCHAR(20) NOT NULL,
    "duration" VARCHAR(50) NOT NULL,
    "guests" INTEGER DEFAULT 1,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "organization" VARCHAR(255),
    "message" TEXT,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "payment_method" VARCHAR(50) NOT NULL,
    "payment_status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "staff_member" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "package_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_booking_addons" (
    "id" SERIAL NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "unit" VARCHAR(50),

    CONSTRAINT "package_booking_addons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_gallery_videos" (
    "id" SERIAL NOT NULL,
    "package_id" INTEGER NOT NULL,
    "video_path" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "package_gallery_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_gallery_images" (
    "id" SERIAL NOT NULL,
    "package_id" INTEGER NOT NULL,
    "image_path" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "package_gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_features" (
    "id" SERIAL NOT NULL,
    "package_id" INTEGER NOT NULL,
    "feature_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "package_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_suitability" (
    "id" SERIAL NOT NULL,
    "package_id" INTEGER NOT NULL,
    "event_type" VARCHAR(255) NOT NULL,

    CONSTRAINT "package_suitability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_addons" (
    "id" SERIAL NOT NULL,
    "package_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" VARCHAR(100) NOT NULL,
    "unit" VARCHAR(100),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "package_addons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hall_bookings" (
    "id" SERIAL NOT NULL,
    "reference" VARCHAR(50) NOT NULL,
    "event_type" VARCHAR(100) NOT NULL,
    "event_name" VARCHAR(255),
    "event_date" DATE NOT NULL,
    "start_time" VARCHAR(20) NOT NULL,
    "duration" VARCHAR(50) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "organization" VARCHAR(255),
    "message" TEXT,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "payment_method" VARCHAR(50) NOT NULL,
    "payment_status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "payment_intent_id" VARCHAR(255),
    "receipt_path" VARCHAR(500),
    "staff_member" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hall_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booked_halls" (
    "id" SERIAL NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "hall_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "booked_halls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hall_booking_addons" (
    "id" SERIAL NOT NULL,
    "booked_hall_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "unit" VARCHAR(50),

    CONSTRAINT "hall_booking_addons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hostel_bookings" (
    "id" SERIAL NOT NULL,
    "reference" VARCHAR(50) NOT NULL,
    "hostel_id" INTEGER NOT NULL,
    "check_in_date" DATE NOT NULL,
    "check_in_time" VARCHAR(20),
    "duration" VARCHAR(50) NOT NULL,
    "guests" INTEGER NOT NULL DEFAULT 1,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "institution" VARCHAR(255),
    "special_requests" TEXT,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "payment_method" VARCHAR(50) NOT NULL,
    "payment_status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "staff_member" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hostel_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hostel_booking_addons" (
    "id" SERIAL NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "unit" VARCHAR(50),

    CONSTRAINT "hostel_booking_addons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" SERIAL NOT NULL,
    "google_id" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255),
    "phone_number" VARCHAR(50),
    "profile_picture" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_hall_addons_hall_id" ON "hall_addons"("hall_id");

-- CreateIndex
CREATE INDEX "idx_hall_plans_hall_id" ON "hall_plans"("hall_id");

-- CreateIndex
CREATE INDEX "idx_hall_plan_features_plan_id" ON "hall_plan_features"("plan_id");

-- CreateIndex
CREATE INDEX "idx_hall_gallery_videos_hall_id" ON "hall_gallery_videos"("hall_id");

-- CreateIndex
CREATE INDEX "idx_hall_gallery_hall_id" ON "hall_gallery_images"("hall_id");

-- CreateIndex
CREATE INDEX "idx_hall_amenities_hall_id" ON "hall_amenities"("hall_id");

-- CreateIndex
CREATE INDEX "idx_hall_suitability_hall_id" ON "hall_suitability"("hall_id");

-- CreateIndex
CREATE INDEX "idx_hostel_gallery_videos_hostel_id" ON "hostel_gallery_videos"("hostel_id");

-- CreateIndex
CREATE INDEX "idx_hostel_gallery_hostel_id" ON "hostel_gallery_images"("hostel_id");

-- CreateIndex
CREATE INDEX "idx_hostel_amenities_hostel_id" ON "hostel_amenities"("hostel_id");

-- CreateIndex
CREATE INDEX "idx_hostel_suitability_hostel_id" ON "hostel_suitability"("hostel_id");

-- CreateIndex
CREATE INDEX "idx_hostel_addons_hostel_id" ON "hostel_addons"("hostel_id");

-- CreateIndex
CREATE UNIQUE INDEX "package_bookings_reference_key" ON "package_bookings"("reference");

-- CreateIndex
CREATE INDEX "package_bookings_package_id_idx" ON "package_bookings"("package_id");

-- CreateIndex
CREATE INDEX "package_booking_addons_booking_id_idx" ON "package_booking_addons"("booking_id");

-- CreateIndex
CREATE INDEX "idx_package_gallery_videos_package_id" ON "package_gallery_videos"("package_id");

-- CreateIndex
CREATE INDEX "idx_package_gallery_images_package_id" ON "package_gallery_images"("package_id");

-- CreateIndex
CREATE INDEX "idx_package_features_package_id" ON "package_features"("package_id");

-- CreateIndex
CREATE INDEX "idx_package_suitability_package_id" ON "package_suitability"("package_id");

-- CreateIndex
CREATE INDEX "idx_package_addons_package_id" ON "package_addons"("package_id");

-- CreateIndex
CREATE UNIQUE INDEX "hall_bookings_reference_key" ON "hall_bookings"("reference");

-- CreateIndex
CREATE INDEX "booked_halls_booking_id_idx" ON "booked_halls"("booking_id");

-- CreateIndex
CREATE INDEX "booked_halls_hall_id_idx" ON "booked_halls"("hall_id");

-- CreateIndex
CREATE INDEX "hall_booking_addons_booked_hall_id_idx" ON "hall_booking_addons"("booked_hall_id");

-- CreateIndex
CREATE UNIQUE INDEX "hostel_bookings_reference_key" ON "hostel_bookings"("reference");

-- CreateIndex
CREATE INDEX "hostel_bookings_hostel_id_idx" ON "hostel_bookings"("hostel_id");

-- CreateIndex
CREATE INDEX "hostel_booking_addons_booking_id_idx" ON "hostel_booking_addons"("booking_id");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clients_google_id_key" ON "clients"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- AddForeignKey
ALTER TABLE "hall_addons" ADD CONSTRAINT "hall_addons_ibfk_1" FOREIGN KEY ("hall_id") REFERENCES "halls"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "hall_plans" ADD CONSTRAINT "hall_plans_ibfk_1" FOREIGN KEY ("hall_id") REFERENCES "halls"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "hall_plan_features" ADD CONSTRAINT "hall_plan_features_ibfk_1" FOREIGN KEY ("plan_id") REFERENCES "hall_plans"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "hall_gallery_videos" ADD CONSTRAINT "hall_gallery_videos_ibfk_1" FOREIGN KEY ("hall_id") REFERENCES "halls"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "hall_gallery_images" ADD CONSTRAINT "hall_gallery_images_ibfk_1" FOREIGN KEY ("hall_id") REFERENCES "halls"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "hall_amenities" ADD CONSTRAINT "hall_amenities_ibfk_1" FOREIGN KEY ("hall_id") REFERENCES "halls"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "hall_suitability" ADD CONSTRAINT "hall_suitability_ibfk_1" FOREIGN KEY ("hall_id") REFERENCES "halls"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "hostel_gallery_videos" ADD CONSTRAINT "hostel_gallery_videos_ibfk_1" FOREIGN KEY ("hostel_id") REFERENCES "hostels"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "hostel_gallery_images" ADD CONSTRAINT "hostel_gallery_images_ibfk_1" FOREIGN KEY ("hostel_id") REFERENCES "hostels"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "hostel_amenities" ADD CONSTRAINT "hostel_amenities_ibfk_1" FOREIGN KEY ("hostel_id") REFERENCES "hostels"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "hostel_suitability" ADD CONSTRAINT "hostel_suitability_ibfk_1" FOREIGN KEY ("hostel_id") REFERENCES "hostels"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "hostel_addons" ADD CONSTRAINT "hostel_addons_ibfk_1" FOREIGN KEY ("hostel_id") REFERENCES "hostels"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "package_bookings" ADD CONSTRAINT "package_bookings_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_booking_addons" ADD CONSTRAINT "package_booking_addons_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "package_bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_gallery_videos" ADD CONSTRAINT "package_gallery_videos_ibfk_1" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "package_gallery_images" ADD CONSTRAINT "package_gallery_images_ibfk_1" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "package_features" ADD CONSTRAINT "package_features_ibfk_1" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "package_suitability" ADD CONSTRAINT "package_suitability_ibfk_1" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "package_addons" ADD CONSTRAINT "package_addons_ibfk_1" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "booked_halls" ADD CONSTRAINT "booked_halls_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "hall_bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booked_halls" ADD CONSTRAINT "booked_halls_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "halls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hall_booking_addons" ADD CONSTRAINT "hall_booking_addons_booked_hall_id_fkey" FOREIGN KEY ("booked_hall_id") REFERENCES "booked_halls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostel_bookings" ADD CONSTRAINT "hostel_bookings_hostel_id_fkey" FOREIGN KEY ("hostel_id") REFERENCES "hostels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostel_booking_addons" ADD CONSTRAINT "hostel_booking_addons_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "hostel_bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

