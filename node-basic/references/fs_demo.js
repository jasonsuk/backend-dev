const fs = require('fs');
const path = require('path');

// Create a folder async version
// fs.mkdirSync -> sync version
// fs.mkdir(path.join(__dirname, '/test'), {}, (err) => {
//     if (err) throw err;
//     console.log('Folder dreated');
// });

// Create and write to file
// fs.writeFile(path.join(__dirname, '/test', 'hello.txt'),
//     'Hello Node',
//     err => {
//         if (err) throw err;
//         console.log('File created');
//     })

// Overwrites what is already in the file
// fs.writeFile(path.join(__dirname, '/test', 'hello.txt'),
//     'I will fall in love with you',
//     err => {
//         if (err) throw err;
//         console.log('File created');
//     })


// Create and append contents to a file - using call back
// fs.writeFile(path.join(__dirname, 'test', 'hello.txt'),
//     'Hi Node',
//     err => {
//         if (err) throw err;
//         console.log('File created');

//         fs.appendFile(path.join(__dirname, 'test', 'hello.txt'),
//             ' I think I will fall in love with you soon!',
//             err => {
//                 if (err) throw err;
//                 console.log('Content appended');
//             })
//     }
// );

// Read file
// fs.readFile(path.join(__dirname, '/test', 'hello.txt'),
//     'utf-8',
//     (err, data) => {
//         if (err) throw err;
//         console.log('Read a file: ', data);
//     })


// Rename file
fs.rename(path.join(__dirname, '/test', 'hello.txt'),
    path.join(__dirname, '/test', 'helloNode.txt'),
    err => {
        if (err) throw err;
        console.log('File renamed...');
    })
