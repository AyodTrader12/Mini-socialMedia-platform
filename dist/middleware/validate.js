"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const AppError_1 = require("../config/AppError");
const validate = (schema) => (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const errors = result.error.issues.map((issue) => {
            return {
                field: issue.path.join("."),
                message: issue.message
            };
        });
        next(new AppError_1.AppError(400, "validation failed", errors));
        return;
    }
    req.body = result.data;
    next();
};
exports.validate = validate;
