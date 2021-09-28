function generateRandomString() {
	let ID = "";
	let possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";

	for (let i = 0; i < 6; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

console.log(generateRandomString());
