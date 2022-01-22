const fs = require('fs').promises;
const express = require('express');
const bodyParser = require('body-parser')
const fortunes = require('./data/fortunes');

const app = express();

// const urlInGoorm = 'https://postgresql.run-eu-central1.goorm.io/';

app.use(bodyParser.json());

app.get('/fortunes', (req, res) => {
	res.json(fortunes);
});

// if /fortunes/:id comes before this route, then /fortunes/route is never executed
app.get('/fortunes/random', (req, res) => {	
	const random_index = Math.floor(Math.random() * fortunes.length);
	const our_fortune = fortunes[random_index];
	
	res.json(our_fortune);
});

app.get('/fortunes/:id', (req, res) => {	
	res.json(fortunes.find(f => f.id == req.params.id));
});

app.post('/fortunes', (req, res) => {	
	const { message, lucky_number, spirit_animal } = req.body;
	const id = fortunes.length + 1;
	const updated_fortunes = fortunes.concat( { 
		id , 
		message, 
		lucky_number, 
		spirit_animal 
		});
	
	/* Sometime this segment empties the file and crashes the app. 
	 * As it is a tutorial I did not analyze the mistake and simply created
	 * a temporary file, where I store further objects without touching the original.
	 * There exists the option to complete the original data file by adding the new
	 * objects in tempFile.json to fortunes.json.
	 */
	try{		
		fs.writeFile('./data/tempFile.json', JSON.stringify(updated_fortunes))
	} catch (error) {
		console.log(error);
	}
	
	res.json(updated_fortunes);
});

module.exports = app;