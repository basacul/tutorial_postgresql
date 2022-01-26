const { Router } = require('express');
const pool = require('../db'); // automatically checks the index.js file

const router = Router();

/*
* When I delete or Put tuples, then I need to update the according relations!
*/

router.get('/', (request, response, next) => {
	pool.query('SELECT * FROM lives', (err, res) => {
		if(err){
			return next(err);
		}
		response.json(res.rows);
	});
})

router.get('/conditions', (request, response, next) => {
	pool.query('SELECT * FROM lives JOIN habitats ON habitats.name = lives.habitat', (err, res) => {
		if(err){
			return next(err);
		}
		response.json(res.rows);
	});
});

module.exports = router;