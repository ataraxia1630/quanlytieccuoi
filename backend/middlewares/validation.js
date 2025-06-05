const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        const errorMessages = errors.array().map(err => ({
            field: err.param,
            message: err.msg
        }));
        throw new ApiError(400, 'Dữ liệu đầu vào không hợp lệ', errorMessages);
    }
    next();
};

module.exports = validate;