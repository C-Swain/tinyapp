
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const generateRandomstring = require("./generateRandomString")

const PORT = 8080; // 8080 is the defualt port 

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
const urlDatabase = {
	"b2xVn2": "http://www.lighthouselabs.ca",
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

app.get("/u/:shortURL", (req, res) => {	
	const shortURL = req.params.shortURL;
	const longURL = urlDatabase[shortURL];
	res.redirect(`${longURL}`);
})
app.get("/urls/new", (req, res) => {
res.render("urls_new");

});

app.post("/urls", (req, res) => {
	const longURL = req.body.longURL;
  const shortURL = generateRandomstring();
	urlDatabase[shortURL] =  `${longURL}`
res.redirect('/urls');       
}); 

app.get("/urls/:shortURL", (req, res) => {
	const shortURL = req.params.shortURL;
  const templateVars = { shortURL: shortURL, longURL: urlDatabase[shortURL]};
		return res.render("urls_show", templateVars);
});

app.post('/urls/:shortURL', (req, res) => {
	console.log("console log for urls/:shortUrl!")
	const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
	console.log("shortURL", shortURL,"longURL", longURL);
	urlDatabase[shortURL] = longURL;

	res.redirect('/urls');
})

app.post('/urls/:shortURL/delete',(req, res) => {
	
	const shortURL = req.params.shortURL;

	delete urlDatabase[shortURL];
  
	res.redirect('/urls');

})

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});

