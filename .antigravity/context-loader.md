# Portfolio Frontend & AI Hub — Documentación de Arquitectura

## 1. Visión General del Proyecto
Aplicación web Full-Stack de alto rendimiento que funciona como portafolio profesional, centro de control de microservicios y punto de interacción para un Agente de Inteligencia Artificial en tiempo real. 

El proyecto sigue una filosofía **FinOps (Costo $0 en reposo)**, aprovechando tecnologías *serverless* y contenedores efímeros (*scale-to-zero*) para mantener costos operativos nulos cuando no hay tráfico activo, sin sacrificar escalabilidad ni velocidad de respuesta.

---

## 2. Stack Tecnológico

* **Framework Core:** Next.js 15+ (App Router) con Turbopack en entorno de desarrollo.
* **Lenguaje:** TypeScript (tipado estricto de extremo a extremo).
* **Estilos y UI:** TailwindCSS.
* **Base de Datos:** Neon Postgres (Serverless PostgreSQL en AWS `us-east-1`).
* **ORM y Migraciones:** Drizzle ORM (`drizzle-orm/neon-http`) + Drizzle Kit.
* **Infraestructura Destino:** Docker (Multi-stage build) desplegado en Google Cloud Run.

---

## 3. Decisiones Arquitectónicas y Reglas de Negocio Técnicas

### 3.1. Empaquetado Standalone (Cloud Run Ready)
* **Configuración:** `output: 'standalone'` habilitado en `next.config.ts`.
* **Propósito:** Al compilar para producción, Next.js genera una carpeta `.next/standalone` que aisla únicamente las dependencias esenciales de `node_modules`. Esto reduce el tamaño de la imagen Docker de >1GB a ~150MB, minimizando el tiempo de *Cold Start* (arranque en frío) en Google Cloud Run cuando el contenedor despierta desde cero.

### 3.2. Conectividad a Base de Datos y Entorno de Red
* **Runtime de Aplicación (`lib/db.ts`):** Utiliza el driver `@neondatabase/serverless` sobre HTTP (`neon-http`) apuntando a la URL con *Connection Pooling* (`-pooler`). Esto evita agotar las conexiones de PostgreSQL durante