class AuthenticationHandler {
  constructor(authenticationService, tokenManager, validator) {
    this._authenticationService = authenticationService;
    this._tokenManager = tokenManager;
    this._validator = validator;
  }

  async postAuthenticationService(req, h) {
    try {
      this._validator.validateAuthenticationValidator(req.payload);
      const { username, password } = req.payload;
      // TODO: have not done yet
      const id = await this._userService.verifyUserCredential(username, password);

      const accessToken = this._tokenManager.generateAccessToken({ id });
      const refreshToken = this._tokenManager.generateAccessToken({ id });

      await this._authenticationService.addRefreshToken(refreshToken);

      return h.response({
        status: 'success',
        message: 'Authentication success',
        data: {
          accessToken,
          refreshToken,
        },
      }).code(201);
    } catch (error) {
      return error;
    }
  }

  async putAuthenticationService(req) {
    try {
      this._validator.validateAuthenticationValidator(req.payload);

      const { refreshToken } = req.payload;
      await this._authenticationService.verifyRefreshToken(refreshToken);
      await this._authenticationService.deleteRefreshToken(refreshToken);

      const accessToken = this._tokenManager.generateAccessToken({ id });

      return {
        status: 'success',
        message: 'refresh token change is successful',
        data: {
          accessToken,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async deleteAuthenticationService(req) {
    try {
      this._validator.validateAuthenticationValidator(req.payload);

      const { refreshToken } = req.payload;
      await this._authenticationService.verifyRefreshToken(refreshToken);
      await this._authenticationService.deleteRefreshToken(refreshToken);

      return {
        status: 'success',
        message: 'refresh token deletion is successful',
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = AuthenticationHandler;
