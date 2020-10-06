//////////////////////////////////////////////////////////////////////
// MODULE WRAPPER FUNCTION
// -> behind the scene which is wrapped around all
// (function(exports, require, module, __filename, __dirname) {});
// console.log(__dirname, __filename);

//////////////////////////////////////////////////////////////////////
// Export class, function or object to another file

// const person = {
// 	name: 'Jason',
// 	age: 30
// };

// module.exports = person;

class Person {
	constructor(name, age) {
		this.name = name;
		this.age = age;
	}

	greeting() {
		console.log(`My name is ${this.name}, and I am ${this.age}`);
	}
}

module.exports = Person;
