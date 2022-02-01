const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttribuites: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
})

const Joi = BaseJoi.extend(extension);

module.exports.spotSchema = Joi.object({
    spot: Joi.object({
        name: Joi.string().escapeHTML().required(),
        location: Joi.string().escapeHTML().required(),
        category: Joi.string().escapeHTML().required(),
        cuisine: Joi.string().escapeHTML().required(),
        reviews: Joi.array(),
        //images: Joi.array().required()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().escapeHTML().required(),
        rating: Joi.number().required().min(0).max(5),
        spot: Joi.string().escapeHTML().hex().length(24)
    }).required()
});