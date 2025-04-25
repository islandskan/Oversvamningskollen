// swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0', // Ensure you're using the correct OpenAPI version
  info: {
    title: 'FloodCast API',
    version: '1.0.0',
    description: 'API documentation for my app',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
};

// Specify the path to your testapi.js for documentation
const options = {
  swaggerDefinition,
  apis: ['./app.js', './docs/testapi.js'], // Make sure this matches the relative path of testapi.js
};

// Generate Swagger spec
const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec, swaggerUi };
