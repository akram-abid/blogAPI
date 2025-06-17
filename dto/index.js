const Joi = require("joi");

const createValidationMiddleware = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      res.status(400).json({
        error: error.details[0].message,
      });
    }

    req.validatedData = value;
    next()
  };
};

const schemas = {
  // Auth schemas
  register: Joi.object({
    fullname: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(), 
    password: Joi.string().min(6).max(128).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Post schemas
  createPost: Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500).optional(),
    body: Joi.string().min(10).required(),
    image: Joi.string().uri().optional(),
    state: Joi.string().valid('draft', 'published').default('draft')
  }),

  updatePost: Joi.object({
    title: Joi.string().min(3).max(100).optional(),
    description: Joi.string().max(500).optional(),
    body: Joi.string().min(10).optional(),
    image: Joi.string().uri().optional(),
    state: Joi.string().valid('draft', 'published').optional()
  }),

  // Comment schemas
  createComment: Joi.object({
    body: Joi.string().min(1).max(1000).required()
  }),

  updateComment: Joi.object({
    body: Joi.string().min(1).max(1000).required()
  })
};

const dtos = {
  // Auth validations
  validateRegister: createValidationMiddleware(schemas.register),
  validateLogin: createValidationMiddleware(schemas.login),
  
  // Post validations
  validateCreatePost: createValidationMiddleware(schemas.createPost),
  validateUpdatePost: createValidationMiddleware(schemas.updatePost),
  
  // Comment validations
  validateCreateComment: createValidationMiddleware(schemas.createComment),
  validateUpdateComment: createValidationMiddleware(schemas.updateComment)
};

module.exports = dtos;
