const fs = require('fs').promises; // promises to avoid crashes
const express = require('express');
const bodyParser = require('body-parser')
var fortunes = require('./data/fortunes'); // var in order to update the values as long the server is alive 


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

const writeFortunes = json => {
	/* In order to avoid crashing the app and deleting the content in 
	 * fortunes.json, you need to ignore all folders, where data might
	 * change. Otherwise nodemon restarts after each change with 
	 * disastrous consequences.
	 */
	try{		
		fs.writeFile('./data/fortunes.json', JSON.stringify(json));
	} catch (error) {
		console.log(error);
	}
};

app.post('/fortunes', (req, res) => {	
	const { message, lucky_number, spirit_animal } = req.body;
	const id = fortunes.length + 1; // id starts with 1
	
	fortunes = fortunes.concat( { 
		id , 
		message, 
		lucky_number, 
		spirit_animal 
		}
	);
	
	writeFortunes(fortunes);
	
	res.json(fortunes);
});

app.put('/fortunes/:id', (req, res) => {
	const { id } = req.params;
	
	if(id > 0 && id <= fortunes.length){
		// old_fortune gets the reference of the entry
		const old_fortune = fortunes.find(f => f.id == id);
		
		['message', 'lucky_number', 'spirit_animal'].forEach(key => {
			if(req.body[key]){old_fortune[key] = req.body[key];}
		});
		
		// fortunes is indirectly updated by old_fortune
		writeFortunes(fortunes);
		
		res.json(fortunes);
		
	}else{
		res.send(`A fortune with the id:${id} does not exist.`);
	}
		
});

app.delete('/fortunes/:id', (req, res) => {
	const { id } = req.params;
	
	if(id > 0 && id <= fortunes.length){
		// remove the object with the respective id
		fortunes = fortunes.filter(f => f.id != id);
		writeFortunes(fortunes);
		res.json(fortunes);
		
	}else{
		res.send(`A fortune with the id:${id} does not exist.`);
	}
});


module.exports = app;