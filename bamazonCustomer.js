var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "qwer2wsx",
    database: "bamazonDB"
});

connection.connect(function(error){
  if(error) throw error;
  console.log("successfully connected to mysql");
});
 
connection.query('SELECT * FROM products', function (error, results, fields) {
  if (error) throw error;
  console.table(results);
  prompt();
});

function prompt(){
 inquirer
  .prompt([
    {
      type: "input",
      name: "itemId",
      message: "What is the id of the product you want to buy?"
    },
    {
      type: "input",
      name: "itemQuantity",
      message: "How much of this item do you want?"
    },
  ])
  .then(function(answers){
    var itemId = answers.itemId;
    var itemQuantity = answers.itemQuantity;

    connection.query("SELECT * FROM products WHERE id = " + itemId, function (error, results, fields) {
      if (error) throw error;
      if(itemQuantity > results[0].stock_quantity){
        console.log("Insufficient quantity!");
        connection.end();
      } else {
        var currentStock = results[0].stock_quantity - itemQuantity;
        var price = results[0].price;

        connection.query("UPDATE products SET stock_quantity = " + currentStock + " WHERE id = " + itemId, function(error, results){
          if (error) throw error;
          console.log("You have purchased $" + price*itemQuantity + " worth of items. There are now " + currentStock + " left.")
          connection.end();
        });
      }
    });
  });
};