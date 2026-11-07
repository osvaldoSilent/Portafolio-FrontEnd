# Backend & Cloud Architecture Hub (`portfolio-frontend`)

Aplicación Full-Stack de alto rendimiento construida con **Next.js 16 (App Router)**, **TypeScript**, **Drizzle ORM** y **Neon Serverless Postgres**, diseñada bajo **Arquitectura Hexagonal (Ports & Adapters)** y una estrategia **FinOps Scale-to-Zero ($0 Idle)**.

Funciona simultáneamente como:
1. **Architecture Mission Control:** Centro de monitoreo e inspección de microservicios (`login-service`, `notifications-service`, pipelines IA).
2. **AI Architecture Agent:** Asistente técnico interactivo entrenado con el contexto arquitectónico del ecosistema.
3. **Dual-Mode Execution (Demo vs Live Backend):** Sin sesión activa opera 100% con adaptadores *Dummy* en memoria (**$0 costo y 0 peticiones a base de datos**); al autenticar mediante el **Gatekeeper (OTP)**, el contenedor de Inyección de Dependencias conmuta en caliente hacia los adaptadores reales en **Neon Postgres** y **Google Cloud Run**.

---

## 1. Arquitectura Hexagonal (Ports & Adapters)

El proyecto desacopla completamente las reglas de negocio del framework (Next.js) y del motor de persistencia (Drizzle / Neon Postgres):

```text
portfolio-frontend/
├── core/                                      # 🟢 HEXÁGONO (TypeScript puro, 0 dependencias externas)
│   ├── domain/
│   │   └── models.ts                          # Entidades y contratos del dominio
│   ├── ports/
│   │   ├── telemetry.repository.ts            # Puerto de salida: Persistencia y telemetría
│   │   └── session.gateway.ts                 # Puerto de salida: Gestión de sesión segura
│   ├── use-cases/
│   │   ├── get-telemetry.use-case.ts          # Caso de uso: Consulta de métricas
│   │   ├── process-agent-chat.use-case.ts     # Caso de uso: Procesamiento del Agente IA
│   │   └── auth-gatekeeper.use-case.ts        # Caso de uso: Solicitud/Verificación OTP y Logout
│   └── openapi/
│       └── spec.ts                            # Especificación OpenAPI 3.1.0 (Swagger equivalent)
│
├── infrastructure/                            # 🔵 ADAPTADORES SECUNDARIOS (Driven Adapters)
│   ├── adapters/
│   │   ├── dummy-telemetry.adapter.ts         # Adaptador Mock ($0 Idle, sin red)
│   │   ├── neon-telemetry.adapter.ts          # Adaptador Real (Drizzle ORM + Neon HTTP)
│   │   └── next-cookie-session.adapter.ts     # Adaptador de Cookies httpOnly de Next.js
│   └── container.ts                           # Contenedor DI (Conmutador Live vs Dummy)
│
├── app/                                       # 🟣 ADAPTADORES PRIMARIOS (Driving Adapters)
│   ├── actions/auth.ts                        # Server Actions (Gatekeeper RPC)
│   ├── api/chat/route.ts                      # Endpoint REST POST /api/chat
│   ├── api/openapi/route.ts                   # Endpoint OpenAPI 3.1 JSON (GET /api/openapi)
│   ├── api-docs/page.tsx                      # Consola interactiva OpenAPI (/api-docs)
│   └── page.tsx                               # Bento Grid Principal (Server Component Streaming)
│
├── components/                                # 🟣 ADAPTADORES UI
│   ├── Header.tsx                             # Barra de control + Disparador del Pop-up Login
│   ├── Gatekeeper.tsx                         # Modal de autenticación por OTP
│   ├── LoginSimulator.tsx                     # Inspector de pipeline JWT (login-service)
│   ├── AgentChat.tsx                          # Chat interactivo del Agente IA
│   ├── MicroserviceMonitor.tsx                # Monitor de contenedores Scale-to-Zero
│   └── Telematry.tsx                          # Panel de telemetría Serverless con <Suspense>
│
└── lib/
    ├── db.ts                                  # Cliente Drizzle + @neondatabase/serverless
    └── schema.ts                              # Esquema declarativo PostgreSQL
```

---

## 2. Documentación de API (OpenAPI 3.1)

El proyecto incluye su propia documentación interactiva equivalente a **Swagger UI**:

* **Consola Interactiva (UI + "Try it out"):** [`http://localhost:3000/api-docs`](http://localhost:3000/api-docs)
* **Especificación Raw JSON (OpenAPI 3.1.0):** [`http://localhost:3000/api/openapi`](http://localhost:3000/api/openapi)

| Método | Ruta / Acción | Descripción | Adaptador Inyectado |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/chat` | Envía una consulta al Agente IA y persiste en Neon si la sesión está activa. | `NeonTelemetryAdapter` (con sesión) / `DummyTelemetryAdapter` (sin sesión) |
| `GET` | `/api/openapi` | Devuelve el esquema estándar OpenAPI 3.1.0 en formato JSON. | `openApiSpec` |
| `RPC` | `requestOtpRequest` | Server Action que valida el correo corporativo y solicita código OTP. | `auth-gatekeeper.use-case` |
| `RPC` | `verifyOtpRequest` | Server Action que verifica el OTP y emite la cookie `httpOnly` `recruiter_session`. | `NextCookieSessionAdapter` |
| `RPC` | `logout` | Server Action que destruye la sesión y regresa el dashboard a Modo Simulación. | `NextCookieSessionAdapter` |

---

## 3. Configuración Local y Seguridad de Variables de Entorno

Ninguna credencial ni código OTP maestro se almacena en el código fuente ni se expone en el cliente.

1. Copia la plantilla `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Configura tus variables en `.env.local`:
   ```env
   DATABASE_URL="postgresql://<user>:<password>@ep-<id>-pooler.<region>.aws.neon.tech/<db>?sslmode=require"
   DIRECT_URL="postgresql://<user>:<password>@ep-<id>.<region>.aws.neon.tech/<db>?sslmode=require"
   GATEKEEPER_MASTER_OTP="tu_codigo_otp_6_digitos"
   ```
3. Instala dependencias y levanta el servidor de desarrollo:
   ```bash
   npm install
   npm run dev
   ```
4. Abre [`http://localhost:3000`](http://localhost:3000) o explora los contratos en [`http://localhost:3000/api-docs`](http://localhost:3000/api-docs).

---

## 4. Despliegue en Google Cloud Run (Docker Multi-Stage)

El proyecto utiliza `output: 'standalone'` en `next.config.ts` y un `Dockerfile` multi-etapa con usuario sin privilegios (`nextjs:nodejs`) que reduce la imagen final a ~150MB para minimizar el *Cold Start*:

```bash
docker build -t portfolio-frontend .
docker run -p 3000:3000 --env-file .env.local portfolio-frontend
```
