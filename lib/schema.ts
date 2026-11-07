// lib/schema.ts
import { pgTable, serial, text, timestamp, json, boolean } from "drizzle-orm/pg-core";

// 1. Tabla de Interacciones (La que ya tienes, para telemetría del chat)
export const agentInteractions = pgTable("agent_interactions", {
  id: serial("id").primaryKey(),
  userMessage: text("user_message").notNull(),
  botResponse: text("bot_response").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 2. NUEVA: Tabla de Proyectos (El contexto para tu Agente IA)
export const portfolioProjects = pgTable("portfolio_projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // Ej: "collectAR", "Experiencia 61"
  description: text("description").notNull(),
  techStack: json("tech_stack").notNull(), // Ej: ["React Native", "Spring Boot", "Kafka"]
  githubUrl: text("github_url"),
  isLive: boolean("is_live").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 3. NUEVA: Tabla de Microservicios (Para el Dashboard Health Check)
export const systemServices = pgTable("system_services", {
  id: serial("id").primaryKey(),
  serviceName: text("service_name").notNull(), // Ej: "login-service"
  framework: text("framework").notNull(), // Ej: "Spring Boot 3", "Next.js"
  healthEndpoint: text("health_endpoint").notNull(), // Ej: "https://login-srv-xxx.run.app/actuator/health"
  finopsStrategy: text("finops_strategy").default("scale-to-zero"),
  lastKnownStatus: text("last_known_status").default("UNKNOWN"), // UP, DOWN, SLEEPING
});