function generateRandomString() {
	let ID = "";
	let possible = "AaBbCcDdEeFfGgHhIiJjKkLMmNnPpQqRrSsTtUuVvWwXxYyZz123456789";

	for (let i = 0; i < 6; i++)
		ID += possible.charAt(Math.floor(Math.random() * possible.length));

	return ID;
}

module.exports = generateRandomString; 
