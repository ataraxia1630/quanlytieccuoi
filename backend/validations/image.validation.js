const { check } = require('express-validator');

const uploadImageValidation = [
    check('image').custom((value, { req }) => {
        if (!req.file) {
            throw new Error('File ảnh là bắt buộc');
        }
        return true;
    }),
];

const getImageUrlValidation = [
    check('imageId')
        .notEmpty()
        .withMessage('imageId là bắt buộc')
        .isString()
        .withMessage('Image ID phải là chuỗi'),
];

module.exports = {
    uploadImageValidation,
    getImageUrlValidation,
};
