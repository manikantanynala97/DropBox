var mysql = require("mysql");

const db = mysql.createConnection({
  ssl: true,
  host: process.env.HOST,     
  user: "admin",
  port:  '3306',
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Connected to the Database Instance");
});

module.exports.authenticate = function (req, res) {
  var uname = req.body.uname;
  var password = req.body.pass;

  db.query(
    "SELECT * FROM accounts WHERE username = ?",
    [uname],
    function (error, results, fields) {
      if (error) {
        res.json({
          status: false,
          message: "Kindly check the query please",
        });
      } else {
        if (results.length > 0) {
          if (password == results[0].password) {
            res.json({
              status: true,
              message: "successfully authenticated",
            });
          } else {
            res.json({
              status: false,
              message: "Email and password does not match",
            });
          }
        } else {
          res.json({
            status: false,
            message: "Email does not exist",
          });
        }
      }
    }
  );
};
