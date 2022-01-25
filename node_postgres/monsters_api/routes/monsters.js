const { Router } = require('express');
const pool = require('../db'); // automatically checks the index.js file

const router = Router();

router.get('/', (request,response, next) => {
	pool.query('SELECT * FROM monsters ORDER BY id ASC', (err, res) => {
		if(err){
			return next(err);
		}

		response.json(res.rows);

	});
});

router.get('/:id', (request,response, next) => {
	const { id } = request.params;
	
	pool.query('SELECT * FROM monsters WHERE id = $1', [id], (err, res) => {
		if(err){
			return next(err);
		}

		response.json(res.rows);

	});
});

router.post('/', (request, response, next) => {
	const { name, personality } = request.body;
	
	pool.query('INSERT INTO monsters(name, personality) VALUES($1, $2)', [name, personality], (err, res) => {
		if(err) return next(err);
		response.redirect('/monsters');
	});
});

router.put('/:id', (request, response, next) => {
	const { id } = request.params;
	const { name, personality } = request.body;
	
	// my solution
	if(name && personality){
		pool.query('UPDATE monsters SET name=$1, personality=$2 WHERE id=$3', [name,personality,id], (err, res) =>{
			if(err) return next(err);
			response.redirect('/monsters');
		});
	}else if(name){
		pool.query('UPDATE monsters SET name=$1 WHERE id=$2', [name,id], (err, res) =>{
			if(err) return next(err);
			response.redirect('/monsters');
		});
	}else if(personality){
		pool.query('UPDATE monsters SET personality=$1 WHERE id=$2', [personality,id], (err, res) =>{
			if(err) return next(err);
			response.redirect('/monsters');
		});		
	}else{
		response.redirect('/monsters');
	}
	
	/* // tutor's solution, which performs for each variable a query
	 *
	 * const keys = ['name', 'personality'];
	 * const fields = [];
	 * keys.forEach(key => {
	 *	 if(request.body[key]) fields.push(key);
	 * });
	 * 
	 * fields.forEach((field, index) => {
	 *	 pool.query(`UPDATE monsters SET ${field}=($1) WHERE id=($2)`, [request.body[field], id], (err, res) => {
	 *		 if(err) return next(err);
	 *		 if(index === fields.length - 1) response.redirect('/monsters');
	 *   });
	 * });
	 */
});

router.delete('/:id', (request, response, next) => {
	const { id } = request.params;
	
	pool.query('DELETE FROM monsters WHERE id=$1', [id], (err, res) => {
		if(err){ 
			return next(err);  
	   }
		response.redirect('/monsters');
	});
});

module.exports = router;