const { body, param } = require('express-validator');

exports.getImageUrlValidation = [
    param('imageId')
        .notEmpty()
        .withMessage('Image ID là bắt buộc')
        .isString()
        .withMessage('Image ID phải là chuỗi'),
];

exports.uploadImageValidation = [];
