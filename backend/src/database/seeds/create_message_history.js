exports.seed = function (knex) {
  knex("message_history").insert([
    {
      message_id: "715501351e222",
      message_user: "Lima",
      message_content: "Teste #1",
    }
  ]);
};