// swagger.js
import swaggerJsDoc from 'swagger-jsdoc';
import path from 'path';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API Information',
      contact: {
        name: 'Developer',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: [path.resolve('Backend', 'routes', '*.js')], // Resolving absolute path, independent of working directory
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerDocs };
