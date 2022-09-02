const knex = require("../../../data/db"); // importing the db config

export default async function handler(req, res) {
  if (req.method === "POST") {
    //console.log("passed for post: ", req.body.groupName);
    const todos = await knex("dataTable").where({
      groupName: req.body.groupName,
      type:req.body.type
    }); // making a query to get all todos
    //console.log("todos: ", todos);
    return res.status(200).json({ todos });
  }
}
