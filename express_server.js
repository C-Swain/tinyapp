
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const app = express();
const express = require("express");
const PORT = 8080; // 8080 is the defualt port 

app.set("view engine", "ejs");

const urlDatabase = {
	"b2xVn2": "http://www.lighthouselabs.ca" ,
	"9sm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
	res.send("Very cool website");

});

app.get("/hello", (req, res) => {
 const templateVars = {greeting : "Hello World!"};
 res.render("hello_world", templateVars);
});

app.get("/urls", (req, res) => {
	const templateVars = { urls: urlDatabase};
	res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
res.render("urls_new");

});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.get("/urls/:shortURL", (req, res) => {
	const shortURL = req.params.shortURL;
  const templateVars = { shortURL: shortURL, longURL: urlDatabase[shortURL]};
		return res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {
	let ID = "";
	let possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";

	for (let i = 0; i < 6; i++)
		ID += possible.charAt(Math.floor(Math.random() * possible.length));

	return ID;
}

console.log(generateRandomString());