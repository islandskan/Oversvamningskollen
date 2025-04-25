// swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0', // Swagger version
  info: {
    title: 'My API', // Your API name
    version: '1.0.0',
    description: 'API documentation for my app',
  },
  servers: [
    {
      url: 'http://localhost:3000', // Your API server URL
    },
  ],
};

// Options for the swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Specify where your API route files are
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec, swaggerUi };

