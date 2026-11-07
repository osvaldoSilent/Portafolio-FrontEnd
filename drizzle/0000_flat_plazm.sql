CREATE TABLE "agent_interactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_message" text NOT NULL,
	"bot_response" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
