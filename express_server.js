
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const generateRandomstring = require("./generateRandomString")
const cookieParser = require('cookie-parser')

const PORT = 8080; // 8080 is the defualt port 

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
const urlDatabase = {
	"b2xVn2": "http://www.lighthouselabs.ca",
	"9sm5xK": "http://www.google.com",
};
//user database
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "buttons@cat.com", 
    password: "meow"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "Busty@blackcat.com", 
    password: "chusty"
  }
}
//HELPER FUNCTIONS 
const addNewUser = (email, password) => {
	const id = generateRandomstring();
	const newUser = {
		id,
		email,
		password,
	};
	users[id] = newUser;
	console.log(newUser);
	return id;
}

const findUserByEmail = (email) => {
	for (let id in users) {
		if (users[id].email === email) {
			return users[id];
		} 
	}
	return false;
}

const validateUser = (email, password) => {
	const user = findUserByEmail(email);

	if(user && user.password === password) {
		return user.id;
	}
	return false;
}

app.get("/", (req, res) => {
	res.send("Very cool website");
  res.redirect('urls');
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

app.get('/register', (req, res) => {
	const templateVars = {userName: null};
	res.render("register",templateVars)
 })

app.post('/register',(req, res) => {
const email = req.body.email;
const password = req.body.password;

const user = findUserByEmail(email);

if (!user) {
const id = addNewUser(email, password);
console.log(id);
res.cookie('user_id', id);
res.redirect('/urls');
}else {
	res.status(403).send('You are already registered please login');
}
});

app.get("/urls/new", (req, res) => {
res.render("urls_new");
})

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

  app.post("/login", (req, res) => {
  const userName = req.body.userName;

	res.redirect('/urls')
	})

	app.post("/logout", (req, res) => {
	res.clearCookie("userName")
	res.redirect('/urls')
	})
	

app.post('/urls/:shortURL', (req, res) => {
	console.log("console log for urls/:shortUrl!")
	const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;

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

