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
  prompt();
});

function prompt(){
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "choose",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        }
    ])
    .then(function(answers){
        var picked = answers.choice;
        if(picked==="View Products for Sale"){
            connection.query("SELECT * FROM products", function(error, results){
                if (error) throw error;
                console.table(results);
                connection.end();
            });
        }
        
        else if(picked === "View Low Inventory"){
            connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(error, results){
                if (error) throw error;
                console.table(results);
                connection.end();
            });
        }
        
        else if(picked === "Add to Inventory"){
            inquirer.prompt([
                {
                    type: "input",
                    name: "id",
                    message: "Select item to restock."
                },
                {
                    type: "input",
                    name: "amount",
                    message: "How much would you like to add?"
                }
            ])
            .then(function(answers2){
                connection.query("UPDATE products SET stock_quantity = stock_quantity + " + answers2.amount + " WHERE id = " + answers2.id, function(error, results){
                    if (error) throw error;
                    connection.query("SELECT * FROM products WHERE id =" + answers2.id, function(error, results2){
                        if (error) throw error;
                        console.table(results2);
                        connection.end();
                    });
                });
            })
        }

        else if(picked === "Add New Product"){
            inquirer.prompt([
                {
                    type: "input",
                    name: "product_name",
                    message: "What product would you like to add?"
                },
                {
                    type: "input",
                    name: "department_name",
                    message: "What department is this product in?"
                },
                {
                    type: "input",
                    name: "price",
                    message: "How much does this product cost? $-----.--"
                },
                {
                    type: "input",
                    name: "stock_quantity",
                    message: "How much of this product do you have?"
                },
            ]).then(function(answers3){
                connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" + answers3.product_name + "','" + answers3.department_name + "','" + answers3.price + "','" + answers3.stock_quantity + "')", function (err, results3) {
                    if(err) throw err;
                    connection.query("SELECT * FROM products WHERE id > 10", function (err, params) {
                        if(err) throw err;
                        console.table(params);
                        connection.end()
                    });
                });
            });
        };
    });
}