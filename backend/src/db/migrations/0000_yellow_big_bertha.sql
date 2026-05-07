CREATE TABLE "activity_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"description" text NOT NULL,
	"user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"holding_company" text,
	"regional_hub" text,
	"region" text,
	"local_company" text,
	"country" text,
	"tokens" integer DEFAULT 0 NOT NULL,
	"tokens_used" integer DEFAULT 0 NOT NULL,
	"package_size" integer DEFAULT 6 NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"notes" text,
	"created_by_admin_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_users" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" uuid NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'client' NOT NULL,
	"mobile" text,
	"region" text,
	"country" text,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "config" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"org_id" text NOT NULL,
	"org_name" text NOT NULL,
	"org_type" text NOT NULL,
	"invited_email" text,
	"created_by_admin_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"accepted_at" timestamp,
	"accepted_by_user_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	CONSTRAINT "invitations_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "organisations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"country" text,
	"region" text,
	"description" text,
	"category" text,
	"category_id" text,
	"status" text DEFAULT 'active' NOT NULL,
	"member_count" integer DEFAULT 0 NOT NULL,
	"registration_id" text,
	"profile_data" jsonb,
	"latest_update_at" timestamp,
	"last_follow_up_at" timestamp,
	"created_by_admin_id" text,
	"moderator_user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pending_registrations" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"company_name" text NOT NULL,
	"submitted_by_user_id" text NOT NULL,
	"submitted_by_name" text NOT NULL,
	"submitted_by_email" text NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"profile_data" jsonb,
	"rejection_reason" text,
	"approved_at" timestamp,
	"approved_by_admin_id" text,
	"rejected_at" timestamp,
	"rejected_by_admin_id" text
);
--> statement-breakpoint
CREATE TABLE "rfi_fields" (
	"id" text PRIMARY KEY NOT NULL,
	"category_id" text NOT NULL,
	"label" text NOT NULL,
	"type" text NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"section" text,
	"order_index" integer DEFAULT 0 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"role" text DEFAULT 'vendor' NOT NULL,
	"account_type" text,
	"org_role" text,
	"company_id" uuid,
	"mobile" text,
	"region" text,
	"country" text,
	"must_change_password" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"company_ids" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "va_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"icon_svg" text DEFAULT '',
	"order_index" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "client_users" ADD CONSTRAINT "client_users_company_id_client_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."client_companies"("id") ON DELETE no action ON UPDATE no action;