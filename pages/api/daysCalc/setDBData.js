const knex = require("../../../data/db"); // importing the db config

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("made request")
    console.log(
      "passed data, ",
      req.body.dataArray,
      req.body.costArray,
      req.body.groupName
    );
    knex("dataTable")
      .select()
      .where("groupName", req.body.groupName)
      .where("type", req.body.type)
      .then(async function (rows) {
        if (rows.length === 0) {
          // no matching records found
          knex("dataTable")
            .insert({
              groupName: req.body.groupName,
              dataArray: req.body.dataArray,
              costArray: req.body.costArray,
              type: req.body.type
            })
            .then(function (result) {
              console.log("made new row", result);
            });
        } else {
          const todos1 = await knex("dataTable")
            .update({
              dataArray: req.body.dataArray,
              costArray: req.body.costArray,
              type: req.body.type
            })
            .where({ groupName: req.body.groupName , type: req.body.type});
          console.log("updated existing column");
        }
      });

    const todos = await knex("dataTable").where({
      groupName: req.body.groupName,
    }); // making a query to get all todos
    //console.log("todos: ", todos);
    return res.status(200).json({ todos });
  }
}
