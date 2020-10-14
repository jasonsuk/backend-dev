const path = require('path');

// Base file name
console.log(__filename);
console.log(path.basename(__filename));

// Directory name
console.log(path.dirname(__filename));

// File extension
console.log(path.extname(__filename));

// Create path object (All in one)
console.log(path.parse(__filename));

// Concatenate path
// ../test/hello.html
console.log(path.join(__dirname, 'test', 'hello.html'));
console.log(path.join(__dirname, 'test/hello.html'));