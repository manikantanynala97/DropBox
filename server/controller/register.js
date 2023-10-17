var mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.HOST,     
  user: "admin",
  ssl: true,
  port:  '3306',
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

console.log("This is DB",db);


db.connect(function (err) {
  if (err) throw err;
  console.log("Connected to db on registration");

});

module.exports.register = function (req, res) {
  var user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.uname,
    password: req.body.pass,
  };
  console.log(user);
  db.query(
    "INSERT INTO filestorage (firstName, lastName, username, password) VALUES (?,?,?,?)",
    [user.firstName, user.lastName, user.username, user.password],
    function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        res.json({
          status: true,
          data: results,
          message: "user registered sucessfully",
        });
      }
    }
  );
};
