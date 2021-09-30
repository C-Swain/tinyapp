
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const generateRandomstring = require("./generateRandomString")
const cookieParser = require('cookie-parser')

const PORT = 8080; // 8080 is the defualt port 

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

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
//Home Page redirects, if logged in it goes to URLS if not it takes you to the log in page
app.get("/", (req, res) => {
	const userID = req.cookies.user_id;
	const loggedinUser = users[userID];
	if (loggedinUser) {
	res.redirect("/urls");
	} else {
  res.redirect("/login");
	}
});

// useless Hello Page 
app.get("/hello", (req, res) => {
 const templateVars = {greeting : "Hello World!"};
 res.render("hello_world", templateVars);
});

// Main URL
app.get("/urls", (req, res) => {
	const userID = req.cookies.user_id;
	const loggedinUser = users[userID];
	const templateVars = { urls: urlDatabase , user: loggedinUser};
	res.render("urls_index", templateVars);
});

//hotlinks 
app.get("/u/:shortURL", (req, res) => {	
	const shortURL = req.params.shortURL;
	const longURL = urlDatabase[shortURL];
	res.redirect(`${longURL}`);
}) 

// this is the registration Page, 
app.get('/register', (req, res) => {
	// here we check the cookies if you are logged in you are sent to URLS
	const userID = req.cookies.user_id;
	const loggedinUser = users[userID];
	if (loggedinUser) {
	res.redirect("/urls");
	} else {
  const templateVars = {user: null};
	res.render("register",templateVars);
}
})

 // This sends registration to database
app.post("/register",(req, res) => {
  const email = req.body.email;
  const password = req.body.password;

	if( email === "" || password === "") {
		return res.status(400).send("please fill out a valid email and password");
	}

  const user = findUserByEmail(email);
  if (!user) {
    const id = addNewUser(email, password);
    console.log(id);
    res.cookie('user_id', id);
    res.redirect('/urls');
    } else {
	    res.status(404).send("You are already registered please login");
  };
})

// this renders the form to make a new URL, 
app.get("/urls/new", (req, res) => {
	const userID = req.cookies.user_id;
	const loggedinUser = users[userID];
	const templateVars = {user: loggedinUser};
  res.render("urls_new",templateVars);
})

//creates new URL
app.post("/urls", (req, res) => {
	const userID = req.cookies.user_id;
	const loggedinUser = users[userID];
	const longURL = req.body.longURL;
  const shortURL = generateRandomstring();
	if (loggedinUser) {
	urlDatabase[shortURL] =  `${longURL}`
res.redirect('/urls');
	} else {
		res.status(403).send(" You must be logged in to create a new URL")	
	}       
}); 

// this is a template for our short link page
app.get("/urls/:shortURL", (req, res) => {
	const shortURL = req.params.shortURL;
	const userID = req.cookies.user_id;
	const loggedinUser = users[userID];
  const templateVars = { shortURL: shortURL, longURL: urlDatabase[shortURL], user: loggedinUser};
		return res.render("urls_show", templateVars);
});

//This loads the login page
app.get("/login", (req, res) => {
  const templateVars = {user: null};
	res.render("login",templateVars)
})

// the login function at work!
app.post("/login", (req, res) => {
  const email = req.body.email;
	const password = req.body.password;

  if( email === "" || password === "") {
		return res.status(400).send("please fill out a valid email and password");
	}

	const user = validateUser(email, password);

  if (user) {
	//if the user passes validation we set the cookie
	
	res.cookie("user_id", user);
	console.log(user);
	res.redirect("/urls")
	return
}
  res.status(403).send("Wrong Credentials, Please try Again")	
})

//this logs out the User ( working)
app.post("/logout", (req, res) => {
	res.clearCookie("user_id")
	res.redirect('/urls')
})
	
// this creates the new short URLS
app.post("/urls/:shortURL", (req, res) => {
	console.log("console log for urls/:shortUrl!")
	const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;

	urlDatabase[shortURL] = longURL;

	res.redirect('/urls');
})

//this deletes objects from the short URL
app.post('/urls/:shortURL/delete',(req, res) => {
	const shortURL = req.params.shortURL;
	delete urlDatabase[shortURL];
	res.redirect('/urls');

})

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});

