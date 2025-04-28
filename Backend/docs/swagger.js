// swagger.js
/* import swaggerJSDoc from 'swagger-jsdoc'; */
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';


// Load the OpenAPI YAML file
const swaggerDocument = YAML.load(path.resolve('Backend/docs/openapi.yaml'));


export { swaggerDocument };
