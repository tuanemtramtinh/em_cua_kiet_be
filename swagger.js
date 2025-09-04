const { version } = require("mongoose");
const { type } = require("os");

const option = {
    definition:{
        openapi: '3.0.0',
        info: {
            title: 'Digital Cultural Passport API',
            version: '1.0.0',
            description: 'API documentation for the Digital Cultural Passport project',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            },
            {
                url: 'https://api.digitalculturalpassport.com',
                description: 'Production server'
            }
        ],
        components: {
            schemas: {
                User: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        example: '64adbc2f8ee9c9f1b4d9d4d5'
                    },
                    name:{
                        type: 'string',
                        example: 'Nguyen Van A'
                    },
                    username: {
                        type: 'string',
                        example: 'masadthu123'
                    },
                    email: {
                        type: 'string',
                        example: 'user@example.com'
                    },
                    password:{
                        type: 'string',
                        example: 'masadthu123'
                    },
                    hobby:{
                        type: 'string',
                        example: 'Reading, Traveling'
                    },
                    sex:{
                        type: 'string',
                        example: 'nam',
                    },
                    avatar:{
                        type: 'string',
                        example: '/avatars/masadthu123/avatar.png'
                    },
                    dob: {
                        type: 'date',
                        example: '1990-01-01'
                    },
                    tick: {
                        type: 'boolean',
                        example: false
                    }
                },
                    }
                }
            }

    },
    apis: ['./routes/*.js']
}

module.exports = option;