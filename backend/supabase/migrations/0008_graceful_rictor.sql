CREATE TYPE "public"."report_type" AS ENUM('1', '2', '3', 'final');--> statement-breakpoint
ALTER TABLE "Reports" ALTER COLUMN "type" SET DATA TYPE report_type;