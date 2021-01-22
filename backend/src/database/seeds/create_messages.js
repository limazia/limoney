exports.seed = function (knex) {
  knex("messages").insert([
    {
      message_id: "685209951e230",
      message_user: "Lima",
      message_content: "Teste #1",
    }
  ]);
};