const connection = require("../../database/connection");
const moment = require("moment");
const cryptoRandomString = require("crypto-random-string");
const money = require("money-math");

moment.locale("pt-br");

class TransferController {
  async transferHistoryById(request, response, next) {
    try {
      const transfersHistory = await connection("users_transfers_history").orderBy("createdAt", "desc");

      const serializedItems = transfersHistory.map((item) => {
        const {
          history_id,
          history_from,
          history_to,
          history_value,
          updateAt,
          createdAt
        } = item;
        return {
          history_id,
          history_from,
          history_to,
          history_value,
          updateAt: moment(updateAt).format("LLL"),
          createdAt: moment(createdAt).format("LLL")
        };
      });

      if (transfersHistory.length <= 0) {
        return response.json([]);
      }
      
      return response.json(serializedItems);
    } catch (error) {
      next(error);
    }
  }

  async transferToUser(request, response, next) {
    try {
      const { transfer_id, transfer_value } = request.body;

      const userFrom = await connection("users")
        .leftJoin("users_balance", "users_balance.balance_user", "=", "users.id")
        .where({ id: request.userId });
      const userTo = await connection("users")
        .leftJoin("users_balance", "users_balance.balance_user", "=", "users.id")
        .where({ id: transfer_id });
      const history_id = cryptoRandomString({ length: 13 });

      const addMoney = money.add(
        parseInt(userTo[0].balance_money).toFixed(2),
        parseInt(transfer_value).toFixed(2)
      );
      const removeMoney = money.subtract(
        parseInt(userFrom[0].balance_money).toFixed(2),
        parseInt(transfer_value).toFixed(2)
      );

      if (!transfer_id) {
        return response.json({ error: "Faltando ID do usuário" })
      } else if(transfer_id === userFrom[0].id){
        return response.json({ error: "Você não pode fazer uma transferência para si mesmo" })
      }

      if (transfer_value <= 0) {
        return response.json({ error: "Valor de transferência inválido" });  
      }

      if (transfer_value > userFrom[0].balance_money) {
        return response.json({ error: "Você não tem dinheiro suficiente para realizar a transferência" });  
      }
      
      const trx = await connection.transaction();

      await trx("users_balance").update({
        balance_money: addMoney
      }).where({ balance_user: transfer_id })
 
      await trx("users_balance").update({
        balance_money: removeMoney
      }).where({ balance_user: request.userId })

      await trx("users_transfers_history").insert({
        history_id,
        history_from: userFrom[0].name,
        history_to: userTo[0].name,
        history_value: transfer_value
      });

      await trx.commit();
      
      const transferDetails = {
        userFrom: userFrom[0].name,
        userTo: userTo[0].name,
        value: transfer_value
      }

      request.io.emit("transferWarning", transferDetails);

      return response.json({ message: "Transferencia realizada com sucesso!" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TransferController();