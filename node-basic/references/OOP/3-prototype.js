// Constructor ES5
function Book(title, author, year) {
    this.title = title;
    this.author = author;
    this.year = year;
}


// getSummary - prototype method
Book.prototype.getSummary = function () {
    return `${this.title} was written by ${this.author} in ${this.year}`
}

// getAge
Book.prototype.getAge = function () {
    const age = new Date().getFullYear() - this.year;
    return `${this.title} is ${age} year's old`
}

// Revise / Change Year
Book.prototype.revise = function (newYear) {
    this.year = newYear;
    this.revised = true;
}

// Instatiate an Object
const book1 = new Book('Book One', 'Writer One', '2018');
const book2 = new Book('Book Two', 'Writer Two', '2019');

// console.log(book1); // no getSummary in this object itself
// console.log(book1.getSummary()); // getSummary stored in __proto__
// console.log(book2.getAge());

book2.revise('2018');
console.log(book2);