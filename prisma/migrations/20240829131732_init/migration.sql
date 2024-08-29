-- CreateTable
CREATE TABLE "Measure" (
    "id" SERIAL NOT NULL,
    "customer_code" TEXT NOT NULL,
    "measure_datetime" TIMESTAMP(3) NOT NULL,
    "measure_type" TEXT NOT NULL,
    "measure_value" INTEGER NOT NULL,
    "measure_uuid" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Measure_pkey" PRIMARY KEY ("id")
);
