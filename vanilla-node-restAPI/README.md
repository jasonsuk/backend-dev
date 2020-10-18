# Vanilla node.js REST API | No Framework

Code along with a youtube material on [Traversy Media](https://www.youtube.com/watch?v=_1xa8Bsho6A)

## Basic syntax

### Set up 1

Get Text file

```
const http = require('http');
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html')
    res.write('<h1>Hi Node.js</h1>')
    res.end()
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Set up 2

Get Jason file, shortened syntax

```
const http = require('http');
const products = require('./data/products') // importing a json file

const server = http.createServer((req, res) => {
    res.writehead(200, {'Content-Type: 'application/json'})
    res.end(JSON.stringify(products)) // no need of parsing on express
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Structing API

Considering MVC Model (no View here, only back-end)

- Create folders and files
  - controllers/productController.js
  - models/productModel.js
