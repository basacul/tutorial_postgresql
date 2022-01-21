const http = require('http');

const hostname= '0.0.0.0'; // for goorm
const port = 4500; // for goorm
const urlInGoorm = 'https://postgresql.run-eu-central1.goorm.io/';

const server = http.createServer((req, res) => {
	res.end('Welcome to Node!');
});

server.listen(port, hostname, () => {
	console.log(`Server running at ${urlInGoorm}`);
}); 