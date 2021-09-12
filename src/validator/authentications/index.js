const InvariantError = require('../../exceptions/InvariantError');
const { AuthenticationSchema } = require('./schema');

const AuthenticationValidator = {
  validateAuthenticationValidator: (payload) => {
    const validationResult = AuthenticationSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationValidator;
