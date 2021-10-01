
const bcrypt = require("bcryptjs");
const generateRandomString = function() {
	let ID = "";
	let possible = "AaBbCcDdEeFfGgHhIiJjKkLMmNnPpQqRrSsTtUuVvWwXxYyZz123456789";

	for (let i = 0; i < 6; i++)
		ID += possible.charAt(Math.floor(Math.random() * possible.length));

	return ID;
}

//this function allows you to create a user and returns the ID so it can be put in a cookie!
const addNewUser = (users,email,password) => {
	const id = generateRandomString();
	const newUser = {
		id,
		email,
		password,
	};
	users[id] = newUser;
	console.log(newUser);
	return id;
}

const validateShortUrl = (shortURL , urlDatabase) => {
	for (let i in urlDatabase) {
		if( i === shortURL) {
	  return true;
    }
	}
	return false;
}

// helper function to get the ID by cross referencing the email 
const findUserByEmail = (email, users) => {
	for (let id in users) {
		if (users[id].email === email) {
			return users[id];
		} 
	}
	return false;
}


// this function creates a object with all the URL belonging to the u
const urlsForUser = (urlDatabase, id) => {
  const userURLs = {};
	console.log('urlDatabase', urlDatabase);
  for (const urlKey in urlDatabase) {
    if ( id === urlDatabase[urlKey].userID) {
      userURLs[urlKey] = urlDatabase[urlKey];
    }
  }
	console.log(userURLs);
	
  return userURLs;
}

const validateUser = (dB, email, password) => {
	const user = findUserByEmail(email, dB) 
	
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




module.exports = { 
	addNewUser,
	generateRandomString,
	urlsForUser,
  validateShortUrl,
  validateUser }