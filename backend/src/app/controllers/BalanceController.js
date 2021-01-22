const connection = require("../../database/connection");
const moment = require("moment");
const cryptoRandomString = require("crypto-random-string");

moment.locale("pt-br");

class BalanceController {
  async findBalanceByUserId(request, response, next) {
    try {
      const { id } = request.params;
      const results = await connection("users")
        .leftJoin("users_balance", "users_balance.balance_user", "=", "users.id")
        .where({ id });

      if (results.length >= 1) {
        const {
          id,
          balance_money,
        } = results[0];

        return response.json({
          id,
          points: balance_money,
        });
      } else {
        response.json({ error: "Nenhum usuário foi encontrado com este id." });
      }
    } catch (error) {
      next(error);
    }
  }

  async updateBalanceById(request, response, next) {
    try {
      const { id } = request.params;
      const { balance_money } = request.body;
 
      if (!id) {
        return response.json({ error: "Faltando ID do usuário" })
      }

      if (!balance_money) {
        return response.json({ error: "Digite um valor" })
      }

      await connection("users_balance")
        .update({ balance_money })
        .where({ balance_user: id });
      
      return response.json({ message: "Pontos atualizado!"});
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BalanceController();
