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

// Magazine constructor inherit Book
function Magazine(title, author, year, month) {
    Book.call(this, title, author, year)
    this.month = month;
}

// Inherit Prototype
Magazine.prototype = Object.create(Book.prototype);

// Instantiate Magazine Object
const mag1 = new Magazine('Mag One', 'John', '2019', 'Jan');
// console.log(mag1);
// console.log(mag1.getSummary());


// Use Magazine constructor
Magazine.prototype.constructor = Magazine;

