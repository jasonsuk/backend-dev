const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // console.log(req.url);

    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url)

    let contentType = 'text/html';
    let extname = path.extname(filePath);

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
        case '.css':
            contentType = 'text/css';
        case '.json':
            contentType = 'application/json';
        case '.png':
            contentType = 'img/png';
        case '.jpg':
            contentType = 'img/jpg';
    }


    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                })
            } else {
                res.writeHead(500);
                res.end(`Server Error`, err.code);
            }
        } else {
            res.writeHead(200, contentType);
            res.end(content, 'utf-8');
        }
    })
})

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log('Server has been loaded!'));