CREATE TABLE `credentials` (
	`url` text NOT NULL,
	`token` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `devices` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`was_detected` integer NOT NULL,
	`is_used` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`type`) REFERENCES `device_types`(`type`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `runnerLog` (
	`date` integer NOT NULL,
	`message` text NOT NULL,
	`type` text DEFAULT 'info' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `device_types` (
	`type` text PRIMARY KEY NOT NULL,
	`is_used` integer DEFAULT true NOT NULL
);
