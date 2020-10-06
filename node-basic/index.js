//////////////////////////////////////////////////////////////////////// Loading modules from another file <- person.js
// const person = require('./person'); // object

const Person = require('./person'); //

const person1 = new Person('John Doe', 30);
person1.greeting();
