const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cryptoRandomString = require("crypto-random-string");
const moment = require("moment");

const connection = require("../../database/connection");
const authConfig = require("../../config/auth");

moment.locale("pt-br");

class AuthController {
  async createUser(request, response, next) {
    try {
      const { name, email, password, confirmpassword } = request.body;
      const user = await connection("users").select("*").where({ email });
      const salt = bcrypt.genSaltSync(10);
      const passwordCrypt = bcrypt.hashSync(password, salt);
      const id = cryptoRandomString({ length: 15 });

      if (!name) {
        return response.json({ error: "Digite um nome" });
      }

      if (!email) {
        return response.json({ error: "Digite um e-mail" });
      } else {
        if (user.length > 0) {
          return response.json({ error: "E-mail já registrado" });
        }
      }

      if (!password) {
        return response.json({ error: "Digite uma senha" });
      }

      if (password != confirmpassword) {
        return response.json({ error: "As senhas não coincidem" });
      }

      const trx = await connection.transaction();

      await trx("users").insert({
        id,
        name,
        email,
        password: passwordCrypt
      });

      await trx("users_balance").insert({
        balance_user: id,
        balance_money: process.env.MONEY_INITIAL,
      });
      
      await trx.commit();

      return response.json({ message: "Conta criada com sucesso" });
    } catch (error) {
      next(error);
    }
  }

  async loginUser(request, response, next) {
    try {
      const { email, password } = request.body;
      const user = await connection("users").select("*").where({ email });

      if (!email) {
        return response.json({ error: "Digite um e-mail" });
      }

      if (!password) {
        return response.json({ error: "Digite uma senha" });
      }

      if (user.length >= 1) {
        if (!(await bcrypt.compare(password, user[0].password))) {
          return response.send({ error: "Senha invalida" });
        }

        user[0].password = undefined;

        const { id } = user[0];
        const token = jwt.sign({ id }, authConfig.secret, { expiresIn: authConfig.expiresIn });

        return response.json({
          type: "bearer",
          token: token,
          refreshToken: null,
        });
      } else {
        return response.json({ error: "Usuário não encontrado" });
      }
    } catch (error) {
      next(error);
    }
  }

  async sessionUser(request, response, next) {
    try {
      return response.json({ id: request.userId });
    } catch (error) {
      next(error);
    }
  }

  async logoutUser(request, response, next) {
    try {
      return response.json({ message: "soon..." });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();