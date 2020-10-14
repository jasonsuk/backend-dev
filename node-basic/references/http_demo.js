const http = require('http');
const { clearScreenDown } = require('readline');

// Create server request 
http.createServer((req, res) => {
    // Write a response
    res.write('Hello World');
    res.end();
}
).listen(5000, console.log('Server running'));
// http://localhost:5000/
