const jwt = require("jsonwebtoken");

const authConfig = require("../../config/auth");

class Authentication {
  async token(request, response, next) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return response.json({ error: "Token não fornecido" });
    }

    const [, token] = authHeader.split(' ');

    try {
      const decoded = jwt.verify(token, authConfig.secret);
      request.userId = decoded.id;

      return next();
    } catch (err) {
      return response.json({ error: "Token invalido..." });
    }
  }
}

module.exports = new Authentication();
