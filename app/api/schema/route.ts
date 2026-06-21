import { NextResponse } from 'next/server';

const openApiSchema = {
  openapi: '3.0.3',
  info: {
    title: 'Fair and Fresh Cleaning API',
    version: '1.0.0',
    description: 'REST API powering the Fair and Fresh cleaning-service marketplace.'
  },
  servers: [
    {
      url: '/api'
    }
  ],
  paths: {
    '/token/': {
      post: {
        summary: 'Obtain JWT token pair',
        description: 'Takes a set of user credentials and returns an access and refresh JSON web token pair.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string' }
                },
                required: ['username', 'password']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Token pair generated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    access: { type: 'string' },
                    refresh: { type: 'string' }
                  }
                }
              }
            }
          },
          '401': {
            description: 'No active account found with the given credentials'
          }
        }
      }
    },
    '/token/refresh/': {
      post: {
        summary: 'Refresh JWT access token',
        description: 'Takes a refresh type JSON web token and returns an access type JSON web token.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  refresh: { type: 'string' }
                },
                required: ['refresh']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Token refreshed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    access: { type: 'string' },
                    refresh: { type: 'string' }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Token is invalid or expired'
          }
        }
      }
    },
    '/category/': {
      get: {
        summary: 'List categories',
        responses: {
          '200': {
            description: 'Paginated list of cleaning categories'
          }
        }
      },
      post: {
        summary: 'Create category (Admin Only)',
        security: [{ BearerAuth: [] }],
        responses: {
          '201': {
            description: 'Category created'
          }
        }
      }
    },
    '/category/{id}/': {
      get: {
        summary: 'Retrieve category'
      },
      put: {
        summary: 'Update category (Admin Only)',
        security: [{ BearerAuth: [] }]
      },
      patch: {
        summary: 'Partial update category (Admin Only)',
        security: [{ BearerAuth: [] }]
      },
      delete: {
        summary: 'Delete category (Admin Only)',
        security: [{ BearerAuth: [] }]
      }
    },
    '/blog/': {
      get: {
        summary: 'List blog posts'
      },
      post: {
        summary: 'Create blog post (Admin Only)',
        security: [{ BearerAuth: [] }]
      }
    },
    '/blog/{id}/': {
      get: {
        summary: 'Retrieve blog post'
      },
      put: {
        summary: 'Update blog post (Admin Only)',
        security: [{ BearerAuth: [] }]
      },
      patch: {
        summary: 'Partial update blog post (Admin Only)',
        security: [{ BearerAuth: [] }]
      },
      delete: {
        summary: 'Delete blog post (Admin Only)',
        security: [{ BearerAuth: [] }]
      }
    },
    '/services/': {
      get: {
        summary: 'List services with relations'
      },
      post: {
        summary: 'Create service (Admin Only)',
        security: [{ BearerAuth: [] }]
      }
    },
    '/services/{id}/': {
      get: {
        summary: 'Retrieve service with relations'
      },
      put: {
        summary: 'Update service (Admin Only)',
        security: [{ BearerAuth: [] }]
      },
      patch: {
        summary: 'Partial update service (Admin Only)',
        security: [{ BearerAuth: [] }]
      },
      delete: {
        summary: 'Delete service (Admin Only)',
        security: [{ BearerAuth: [] }]
      }
    },
    '/upload/': {
      post: {
        summary: 'Upload media file (Admin Only)',
        security: [{ BearerAuth: [] }]
      }
    }
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

export async function GET() {
  return NextResponse.json(openApiSchema, { status: 200 });
}
