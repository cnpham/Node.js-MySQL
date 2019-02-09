var mysql = require("mysql");
var inquirer = require("inquirer");

// connection to database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3939,
    user: "KoG",
    password: "",
    database: "bamazon"
});

// connection to mySQL server and database
connection.connect(function (err) {
    if (err) throw err;
    start();
});

// function that prompts user for item ID and units wanted
function start() {
    connection.query("SELECT * FROM auctions", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "order",
                    type: "input",
                    message: "What is the ID of the product you want to buy?",
                },
                {
                    name: "units",
                    type: "input",
                    message: "How many units do you want to buy?",
                    validate: function (value) {
                        if (isNaN(value) == false) {
                            return true;
                        }
                        return false;
                    },
                }
            ])
            .then(function (answer) {
                var item;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_name === answer.choice) {
                        item = results[i];
                    }
                }

                if (item.quantity < parseInt(answer.units)) {
                    connection.query(
                        function (error) {
                            if (error) throw err;
                            console.log("Your order has been placed.");
                            start();
                        }
                    );
                }
                else {
                    console.log("Insufficient quantity!");
                    start();
                }
            });
    });
}