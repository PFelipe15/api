/*
  Warnings:

  - The primary key for the `Measure` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Measure" DROP CONSTRAINT "Measure_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Measure_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Measure_id_seq";
