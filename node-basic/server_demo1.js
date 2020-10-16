// Load node modules
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
    // console.log(req.url);

    // index page
    if (req.url === '/') {

        fs.readFile(path.join(__dirname, '/public', 'index.html'), 'utf-8', (err, content) => {

            if (err) throw err;

            // Add Content-Type
            res.writeHead(200, { 'Content-Type': 'text/html' })

            // Put contents
            // res.end('<h1>Home Page</h1>'); 
            res.end(content);
        })
    }

    if (req.url === '/about') {
        fs.readFile(path.join(__dirname, '/public/about.html'), 'utf-8', (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(content);
        })
    }
    // Let's say we get data from REST API -> JSON file
    // Just an example only.
    if (req.url === '/api/users') {
        const users = [
            { name: 'Jason Suk', age: 23 },
            { name: 'John Doe', age: 30 }
        ];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    }
});

// look for environmental variable first and then 5000;
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log('Server running on port', PORT));