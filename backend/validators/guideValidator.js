const joi = require('joi');
const { GUIDE_TYPE } = require('../utils/constants');

exports.guideValidator = joi.object({
    userId: joi.string().required(),
    guideType: joi.string().valid(...Object.values(GUIDE_TYPE)).required(),
    dissertationTitle: joi.string().min(5).max(300),
    guidedYear: joi.number().required(),
    studentDetails: joi.object({
        name: joi.string().min(3).max(60).required(),
        idNumber: joi.string().length(7)
    }),
    reports: joi.array().items(
        joi.object({
            title: joi.string().required(),
            url: joi.string().required()
        })
    )
});