// validation/purchaseValidation.js
const Joi = require("joi");

const purchaseSchema = Joi.object({
  userId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "Invalid user ID format",
    "any.required": "User ID is required",
  }),
  amount: Joi.number().greater(1000).required().messages({
    "number.greater": "Purchase amount must exceed 1000 Rs",
    "any.required": "Amount is required",
  }),
});

module.exports = { purchaseSchema };
