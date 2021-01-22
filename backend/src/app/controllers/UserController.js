const connection = require('../../database/connection');
const bcrypt = require('bcrypt');
const moment = require("moment")
moment.locale("pt-br");

class UserController {
  async listAllUsers(request, response, next) {
    try {
      const users = await connection("users")
        .leftJoin("users_balance", "users_balance.balance_user", "=", "users.id")
        .orderBy("users.createdAt", "desc");;

      const serializedItems = users.map((item) => {
        const {
          id,
          name,
          balance_money,
          updateAt,
          createdAt
        } = item;
        return {
          id,
          name,
          balance: balance_money,
          updateAt: moment(updateAt).format("LLL"),
          createdAt: moment(createdAt).format("LLL"),
        };
      });

      if (users.length > 0) {
        return response.json(serializedItems);
      } else {
        return response.json({ error: "Nenhum usuário encontrado." });
      }
    } catch (error) {
      next(error);
    }
  }

  async findUserById(request, response, next) {
    try {
      const { id } = request.params;
      const results = await connection("users")
        .leftJoin("users_balance", "users_balance.balance_user", "=", "users.id")
        .where({ id });

      if (results.length >= 1) {
        const {
          id,
          email,
          name,
          balance_money,
          updateAt,
          createdAt
        } = results[0];

        return response.json({
          id,
          email,
          name,
          balance: balance_money,
          updateAt: moment(updateAt).format("LLL"),
          createdAt: moment(createdAt).format("LLL")
        });
      } else {
        response.json({ error: "Nenhum usuário foi encontrado com este id." });
      }
    } catch (error) {
      next(error);
    }
  }

  async updateUserById(request, response, next) {
    try {
      const { name, email, password, newPassword, confirmNewPassword } = request.body;
      const user = await connection("users").select("*").where({ id: request.userId });
      const userEmail = await connection("users").select("*").where({ email });

      let isName;
      let isEmail;
      let isPassword;

      if (email) {
        if (email === user[0].email) {
          isEmail = user[0].email;
        } else{
          if (userEmail.length >= 1) {
            return response.json({ error: "E-mail já registrado." });
          } else {
            isEmail = email;
          }
        }
      } else {
        return response.json({ error: "Digite um email." });
      }

      if (password) {
        if ((await bcrypt.compare(password, user[0].password))) {
            if (newPassword === confirmNewPassword) {
              const salt = bcrypt.genSaltSync(10);
              const passwordCrypt = bcrypt.hashSync(newPassword, salt);
              isPassword = passwordCrypt;
            }else{
              return response.json({ error: "Senha não coincidem." });
            }
        }else{
          return response.json({ error: "Senha invalida." });
        }
      } else {
        isPassword = user[0].password;
      }

      if (name) {
        isName = name;
      }else{
        return response.json({ error: "Digite um nome." });
      }

        await connection("users")
          .update({
            email: isEmail,
            name: isName,
            password: isPassword,
          })
          .where({ id: request.userId });

        return response.json({ message: "Conta atualizada com sucesso." });
    } catch (error) {
      next(error);
    }
  }

  async deleteUserById(request, response, next) {
    try {
      const { id } = request.params;

      return response.json({ user: id });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();