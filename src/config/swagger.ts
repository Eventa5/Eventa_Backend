import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Eventa API",
      version: "1.0.0",
      description: "[/api/docs/swagger.json](/api/docs/swagger.json)",
    },
    url: {
      description: "API documentation",
      url: "/api/docs/swagger.json",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  apis: [
    "./src/routes/**/*.ts", // TypeScript 文件
    "./src/controllers/**/*.ts",
    "./src/schemas/swagger/*.ts", // 加入共用 schema 定義文件
    "./dist/routes/**/*.js", // 編譯後的 JS 文件
    "./dist/controllers/**/*.js",
    "./dist/schemas/swagger/*.js",
  ],
};

// initialize swagger-jsdoc
const specs = swaggerJSDoc(options);

export { specs, swaggerUi };
