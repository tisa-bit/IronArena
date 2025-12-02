import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API documentation",
      version: "1.0.0",
      description: "These are the documentation for the web app side",
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
    security: [{ bearerAuth: [] }],
  },
  apis: ["./api/**/*.js"],
};

export default swaggerJSDoc(options);
