// swagger.js

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API Documentation',
            version: '1.0.0',
            description: 'API documentation generated with Swagger'
        },
        servers: [
            {
                url: 'http://localhost:3002', // Change this to your server URL
                description: 'Local server'
            }
        ]
    },
    apis: ['./routes/*.js'] // Path to the API routes files
};

const specs = swaggerJsdoc(options);

module.exports = {
    serve: swaggerUi.serve,
    setup: swaggerUi.setup(specs)
};
