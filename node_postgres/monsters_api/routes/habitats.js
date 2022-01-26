const { Router } = require('express');
const pool = require('../db'); // automatically checks the index.js file

const router = Router();

router.get('/', (request,response, next) => {
	pool.query('SELECT * FROM habitats ORDER BY id ASC', (err, res) => {
		if(err){
			return next(err);
		}

		response.json(res.rows);

	});
});

router.get('/:id', (request,response, next) => {
	const { id } = request.params;
	console.log(id);
	pool.query('SELECT * FROM habitats WHERE id = $1', [id], (err, res) => {
		if(err){
			return next(err);
		}

		response.json(res.rows);

	});
});



router.post('/', (request, response, next) => {
	const {name, climate, temperature } = request.body;
	
	pool.query('INSERT INTO habitats(name, climate, temperature) VALUES($1, $2, $3)', [name, climate, temperature], (err, res) => {
		if(err){
			return next(err);
		}
		response.redirect('/habitats');
	});
});

router.put('/:id', (request, response, next) => {
	const { id } = request.params;	
	const { name, climate, temperature } = request.body;
	
	// my stupidly simple solution
	if(name && climate && temperature){
		pool.query('UPDATE habitats SET name=$1, climate=$2, temperature=$3 WHERE id=$4', [name,climate, temperature,id], (err, res) =>{
			if(err) return next(err);
			response.redirect('/habitats');
		});
	}else if(name && climate){
		pool.query('UPDATE habitats SET name=$1, climate=$2 WHERE id=$3', [name,climate,id], (err, res) =>{
			if(err) return next(err);
			response.redirect('/habitats');
		});
	}else if(name && temperature){
		pool.query('UPDATE habitats SET name=$1, temperature=$2 WHERE id=$3', [name,temperature,id], (err, res) =>{
			if(err) return next(err);
			response.redirect('/habitats');
		});
	}else if(climate && temperature){
		pool.query('UPDATE habitats SET climate=$1, temperature=$2 WHERE id=$3', [climate,temperature,id], (err, res) =>{
			if(err) return next(err);
			response.redirect('/habitats');
		});		
	}else if(name){
		pool.query('UPDATE habitats SET name=$1 WHERE id=$2', [name,id], (err, res) =>{
			if(err) return next(err);
			response.redirect('/habitats');
		});
	}else if(climate){
		pool.query('UPDATE habitats SET climate=$1 WHERE id=$2', [climate,id], (err, res) =>{
			if(err) return next(err);
			response.redirect('/habitats');
		});
	}else if(temperature){
		pool.query('UPDATE habitats SET temperature=$1 WHERE id=$2', [temperature,id], (err, res) =>{
			if(err) return next(err);
			response.redirect('/habitats');
		});
	}else{
		response.redirect('/habitats');
	}
	 
});

router.delete('/:id', (request, response, next) => {
	const { id } = request.params;
	
	pool.query('DELETE FROM habitats WHERE id=$1', [id], (err, res) => {
		if(err){ 
			return next(err);  
	   }
		response.redirect('/habitats');
	});
});





module.exports = router;