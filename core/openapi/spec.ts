// core/openapi/spec.ts

export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Backend & Cloud Architecture Hub — OpenAPI Specification",
    version: "1.0.0",
    description:
      "Documentación de contratos HTTP, Route Handlers y Server Actions bajo Arquitectura Hexagonal (Ports & Adapters) y estrategia FinOps Scale-to-Zero ($0 Idle).",
    contact: {
      name: "Cloud Architecture Mission Control",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Entorno Local (Next.js Turbopack)",
    },
    {
      url: "https://portfolio-frontend.run.app",
      description: "Producción Serverless (Google Cloud Run)",
    },
  ],
  tags: [
    {
      name: "AI Architecture Agent",
      description:
        "Interacción con el Agente IA y persistencia condicional en Neon Postgres.",
    },
    {
      name: "Gatekeeper Auth (Server Actions)",
      description:
        "Flujo de autenticación OTP y emisión de sesión httpOnly para desbloquear adaptadores reales.",
    },
    {
      name: "Telemetry & Health",
      description:
        "Métricas en vivo de base de datos serverless y especificación OpenAPI.",
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "recruiter_session",
        description:
          "Cookie httpOnly emitida tras validar el OTP en el Gatekeeper (`active_session`). Determina si el contenedor de Inyección de Dependencias usa `NeonTelemetryAdapter` (Live) o `DummyTelemetryAdapter` (Mock $0).",
      },
    },
    schemas: {
      ChatRequest: {
        type: "object",
        required: ["message"],
        properties: {
          message: {
            type: "string",
            maxLength: 120,
            example: "¿Cómo funciona el login-service?",
            description: "Pregunta técnica enviada al Agente de Arquitectura.",
          },
        },
      },
      ChatInteractionResult: {
        type: "object",
        required: ["response", "persistedInDb", "mode"],
        properties: {
          response: {
            type: "string",
            example:
              "El login-service está construido en Java con Spring Boot. Valida credenciales, aplica reglas de negocio y emite un JWT firmado usando arquitectura hexagonal.",
          },
          persistedInDb: {
            type: "boolean",
            example: true,
            description:
              "Indica si la interacción fue persistida en Neon Postgres (`true` con sesión activa, `false` en Modo Demo).",
          },
          mode: {
            type: "string",
            enum: ["LIVE_NEON", "DEMO_DUMMY"],
            example: "LIVE_NEON",
          },
        },
      },
      TelemetryStats: {
        type: "object",
        required: [
          "interactionsCount",
          "latencyMs",
          "databaseRegion",
          "poolerStatus",
          "driverName",
          "isLive",
        ],
        properties: {
          interactionsCount: { type: "integer", example: 42 },
          latencyMs: { type: "integer", example: 18 },
          databaseRegion: { type: "string", example: "aws-us-east-1 (Pooler)" },
          poolerStatus: {
            type: "string",
            enum: ["ACTIVE_POOLER", "DEMO_OFFLINE"],
            example: "ACTIVE_POOLER",
          },
          driverName: {
            type: "string",
            example: "@neondatabase/serverless (HTTP Live)",
          },
          isLive: { type: "boolean", example: true },
        },
      },
      OtpRequestPayload: {
        type: "object",
        required: ["email"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "reclutador@empresa.com",
          },
        },
      },
      OtpVerifyPayload: {
        type: "object",
        required: ["email", "otp"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "reclutador@empresa.com",
          },
          otp: {
            type: "string",
            minLength: 6,
            maxLength: 6,
            example: "******",
            description: "Código OTP temporal de 6 dígitos.",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "string",
            example: "Mensaje vacío",
          },
        },
      },
    },
  },
  paths: {
    "/api/chat": {
      post: {
        tags: ["AI Architecture Agent"],
        summary: "Procesar consulta técnica en el Agente IA",
        description:
          "Ejecuta el caso de uso `processAgentChatUseCase`. Si existe la cookie `recruiter_session`, inyecta `NeonTelemetryAdapter` y persiste la interacción en Neon Postgres; de lo contrario, inyecta `DummyTelemetryAdapter` sin costo de base de datos.",
        security: [{ cookieAuth: [] }, {}],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ChatRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Respuesta generada exitosamente por el Agente IA.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ChatInteractionResult" },
              },
            },
          },
          "400": {
            description: "Payload inválido o mensaje vacío.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "Error interno del servidor.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/openapi": {
      get: {
        tags: ["Telemetry & Health"],
        summary: "Obtener especificación OpenAPI 3.1.0 (JSON)",
        description:
          "Devuelve el contrato completo de la arquitectura en formato estándar OpenAPI 3.1.0 para importar en Swagger, Postman o Insomnia.",
        responses: {
          "200": {
            description: "Documento OpenAPI 3.1.0 JSON.",
          },
        },
      },
    },
    "/actions/auth/requestOtpRequest": {
      post: {
        tags: ["Gatekeeper Auth (Server Actions)"],
        summary: "Server Action: Solicitar código OTP de acceso",
        description:
          "Ejecuta `requestOtpUseCase(email)`. Valida el formato del correo corporativo e inicia el flujo de emisión OTP.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/OtpRequestPayload" },
            },
          },
        },
        responses: {
          "200": {
            description: "Resultado de validación y envío de OTP.",
          },
        },
      },
    },
    "/actions/auth/verifyOtpRequest": {
      post: {
        tags: ["Gatekeeper Auth (Server Actions)"],
        summary: "Server Action: Verificar OTP y emitir cookie de sesión",
        description:
          "Ejecuta `verifyOtpUseCase(email, otp, sessionGateway)`. Valida el OTP contra la variable de entorno `GATEKEEPER_MASTER_OTP` en el servidor y establece la cookie `recruiter_session` (`httpOnly`, TTL 300s).",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/OtpVerifyPayload" },
            },
          },
        },
        responses: {
          "200": {
            description:
              "Sesión establecida (`Set-Cookie: recruiter_session=active_session; HttpOnly; Max-Age=300`).",
          },
        },
      },
    },
  },
};

