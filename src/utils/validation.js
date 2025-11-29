const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('Employer', 'Job Seeker').required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const jobSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    employmentType: Joi.string().valid('Full-time', 'Part-time', 'Contract', 'Internship').required()
});

const applicationSchema = Joi.object({
    jobId: Joi.string().required()
});

module.exports = {
    registerSchema,
    loginSchema,
    jobSchema,
    applicationSchema
};
