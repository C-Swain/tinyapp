
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const generateRandomstring = require("./generateRandomString")
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const bcrypt = require('bcryptjs');
const PORT = 8080; // 8080 is the defualt port 

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['I like secret keys!', '159243adfsafds 45481d'],
}))	

// the URL database 
const urlDatabase = {
	b6UTxQ: {
			longURL: "https://www.tsn.ca",
			userID: "user2RandomID"
	},
	i3BoGr: {
			longURL: "https://www.google.ca",
			userID:  "user2RandomID"
	}

};


//user database
const users = { 
  "aJ48lW": {
    id: "aJ48lW", 
    email: "buttons@cat.com", 
    password: "meow"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "Busty@blackcat.com", 
    password: "$2a$10$V55qSK3G8b1P8VunKCTomeYDMTv7igPO86SfmXzxrFnlwwaTar0Cu",

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

// this function creates a object with all the URL belonging to the user
const urlsForUser = function(id) {
  const userURLs = {};
  for (const urlKey in urlDatabase) {
    if ( id === urlDatabase[urlKey].userID) {
      userURLs[urlKey] = urlDatabase[urlKey];
    }
  }
  return userURLs;
}

// helper function to get the ID by cross referencing the email 
const findUserByEmail = (email) => {
	for (let id in users) {
		if (users[id].email === email) {
			return users[id];
		} 
	}
	return false;
}

const validateUser = (dB, email, password) => {
	const user = findUserByEmail(email) 
	console.log(user);
	if (user) {
		
		if (bcrypt.compareSync(password, user.password)) {
			// Email & password match
			return { user: user, error: null };
		}
		// Bad password
		return { user: null, error: "bad password" };
	}
	// Bad email
	return { user: null, error: "bad email" };

};


const validateShortUrl = (shortURL) => {
	for (let i in urlDatabase) {
		if( i === shortURL) {
	  return true;
    }
	}
	return false;
}



//Home Page redirects, if logged in it goes to URLS if not it takes you to the log in page
app.get("/", (req, res) => {
	const userID = req.session.id;
	const loggedinUser = users[userID];
	if (loggedinUser) {
	return res.redirect("/urls");
	
} 
  res.redirect("/login");

});

// useless Hello Page 
app.get("/hello", (req, res) => {
 const templateVars = {greeting : "Hello World!"};
 res.render("hello_world", templateVars);
});

// Main URL
app.get("/urls", (req, res) => {
	const userID = req.session.id;
	const loggedinUser = users[userID];
	if(!loggedinUser) {
		return res.status(401).json(" You must but logged in to view this site ") 
		}
	const	urls = urlsForUser(userID); ;
	const templateVars = { urls: urls , user: loggedinUser};
	res.render("urls_index", templateVars);
});

//hotlinks 
app.get("/u/:shortURL", (req, res) => {	
	const shortURL = req.params.shortURL;
	if(validateShortUrl(shortURL)) {
	const longURL = urlDatabase[shortURL].longURL;
  res.redirect(`${longURL}`);
	} else {
	res.status(400).send("The Short URL you have entered is not associated with any Tinyapp link");
	}
}) 

// this is the registration Page, 
app.get('/register', (req, res) => {
	// here we check the cookies if you are logged in you are sent to URLS
	const userID = req.session.id;
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
		const hashedPass = bcrypt.hashSync(password, 10);
    const id = addNewUser(email, hashedPass);
    console.log(id);
    req.session.id = id;
    res.redirect('/urls');
    } else {
	    res.status(404).send("You are already registered please login");
			
	}

});

// this renders the form to make a new URL, 
app.get("/urls/new", (req, res) => {
	const userID = req.session.id;
	const loggedinUser = users[userID];
	const templateVars = {user: loggedinUser};
  res.render("urls_new",templateVars);
})

//creates new URL
app.post("/urls", (req, res) => {
	const userID = req.session.id;
	const loggedinUser = users[userID]
	const longURL = req.body.longURL;
  const shortURL = generateRandomstring();
	if (loggedinUser) {
	urlDatabase[shortURL]= {longURL: longURL, userID: userID}
res.redirect('/urls');
	} else {
	res.status(403).send(" You must be logged in to create a new URL")	
	}       
}); 

// this is a template for our short link page
app.get("/urls/:shortURL", (req, res) => {
	const shortURL = req.params.shortURL;
	if(validateShortUrl(shortURL)) {
	const longURL = urlDatabase[shortURL].longURL;
	const userID = req.session.id;
	const loggedinUser = users[userID];
  const templateVars = { shortURL: shortURL, longURL: longURL, user: loggedinUser};
		return res.render("urls_show", templateVars);
	} else {
		res.status(400).send("The Short URL you have entered is not associated with any Tinyapp link")
	}

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
	const dB = users;

  if( email === "" || password === "") {
		return res.status(400).send("please fill out a valid email and password");
	}
	const user = validateUser(dB, email, password);

  if (user) {
	//if the user passes validation we set the session
	const userID = user.user.id
	  req.session.id = userID;
    res.redirect("/urls")
		return
  }
    res.status(403).send("Wrong Credentials, Please try Again")	

});

//this logs out the User
app.post("/logout", (req, res) => {
	req.session = null;
	res.redirect('/login')
})
	
// this updates the new short URLS
app.post("/urls/:shortURL", (req, res) => {
	console.log("console log for urls/:shortUrl!")
	const userID = req.session.id;
	const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
	if (userID !== urlDatabase[shortURL].userID) {
		res.send(" Only the Owner can edit the ShortURL")}
	urlDatabase[shortURL] = {longURL: longURL, userID: userID}
	res.redirect('/urls');
})

//this deletes objects from the short URL
app.post('/urls/:shortURL/delete',(req, res) => {
	const shortURL = req.params.shortURL;
	const user = req.session.id;
	if (user !== urlDatabase[shortURL].userID) {
	  res.send(" Only the Owner can delete the ShortURL")
  }
	delete urlDatabase[shortURL];
	res.redirect('/urls');
});

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});