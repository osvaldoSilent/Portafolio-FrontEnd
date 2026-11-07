# Portfolio Frontend & AI Hub — Documentación de Arquitectura

## 1. Visión General del Proyecto
Aplicación web Full-Stack de alto rendimiento que funciona como portafolio profesional, centro de control de microservicios y punto de interacción para un Agente de Inteligencia Artificial en tiempo real.

El proyecto sigue una filosofía **FinOps (Costo $0 en reposo)**, aprovechando tecnologías *serverless* y contenedores efímeros (*scale-to-zero*) para mantener costos operativos nulos cuando no hay tráfico activo, sin sacrificar escalabilidad ni velocidad de respuesta.

---

## 2. Stack Tecnológico

* **Framework Core:** Next.js 16 (App Router) con `cacheComponents: true` y Turbopack.
* **Arquitectura de Software:** Arquitectura Hexagonal (Ports & Adapters) con inversión de dependencias (`core/` + `infrastructure/`).
* **Lenguaje:** TypeScript (tipado estricto de extremo a extremo).
* **Estilos y UI:** TailwindCSS 4 (Bento Grid Dark UI).
* **Base de Datos:** Neon Postgres (Serverless PostgreSQL en AWS `us-east-1`).
* **ORM y Migraciones:** Drizzle ORM (`drizzle-orm/neon-http`) + Drizzle Kit.
* **Documentación de Contratos:** OpenAPI 3.1.0 (`/api/openapi` y consola interactiva en `/api-docs`).
* **Infraestructura Destino:** Docker (Multi-stage build) desplegado en Google Cloud Run.

---

## 3. Decisiones Arquitectónicas y Reglas de Negocio Técnicas

### 3.1. Empaquetado Standalone (Cloud Run Ready)
* **Configuración:** `output: 'standalone'` habilitado en `next.config.ts`.
* **Propósito:** Al compilar para producción, Next.js genera una carpeta `.next/standalone` que aísla únicamente las dependencias esenciales de `node_modules`. Esto reduce el tamaño de la imagen Docker de >1GB a ~150MB, minimizando el tiempo de *Cold Start* (arranque en frío) en Google Cloud Run cuando el contenedor despierta desde cero.

### 3.2. Conectividad a Base de Datos y Entorno de Red
* **Runtime de Aplicación (`lib/db.ts`):** Utiliza el driver `@neondatabase/serverless` sobre HTTP (`neon-http`) apuntando a la URL con *Connection Pooling* (`-pooler`). Esto evita agotar las conexiones de PostgreSQL durante picos de concurrencia en entornos serverless.
* **Migraciones (`drizzle.config.ts`):** Utiliza `DIRECT_URL` (sin pooler) exclusivamente para operaciones DDL con Drizzle Kit.

### 3.3. Arquitectura Hexagonal y Conmutación Dual (FinOps Gatekeeper)
* **Modo Simulación (`isUnlocked = false`):** Cuando un visitante abre el dashboard sin haberse autenticado, el contenedor [`infrastructure/container.ts`](../infrastructure/container.ts) inyecta [`DummyTelemetryAdapter`](../infrastructure/adapters/dummy-telemetry.adapter.ts). La UI es 100% funcional con datos simulados sin realizar llamadas de red a Neon Postgres ni despertar contenedores en Cloud Run.
* **Modo Live Backend (`isUnlocked = true`):** Al autenticarse mediante el modal [`Gatekeeper`](../components/Gatekeeper.tsx), se emite una cookie `httpOnly` (`recruiter_session`) con TTL de 5 minutos. El contenedor DI inyecta automáticamente [`NeonTelemetryAdapter`](../infrastructure/adapters/neon-telemetry.adapter.ts), habilitando lecturas y escrituras reales en Neon Postgres y pruebas en vivo desde el dashboard y desde `/api-docs`.
