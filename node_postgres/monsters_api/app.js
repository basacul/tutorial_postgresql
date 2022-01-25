const express = require('express');
const pool = require('./db'); // automatically checks the index.js file
const app = express();


app.get('/monsters', (request,response) => {
	pool.query('SELECT * FROM monsters ORDER BY id ASC', (err, res) => {
		if(err){
			//console.log(err);
			res.send('There is an internal error and the server crashed...');
		}

		response.json(res.rows);

	});
});

module.exports = app;