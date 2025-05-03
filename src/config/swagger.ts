import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Eventa API",
      version: "1.0.0",
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
    "./dist/routes/**/*.js", // 編譯後的 JS 文件
    "./dist/controllers/**/*.js",
  ],
};

// initialize swagger-jsdoc
const specs = swaggerJSDoc(options);

export { specs, swaggerUi };
