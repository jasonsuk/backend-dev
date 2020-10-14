// Constructor ES5
function Book(title, author, year) {
    this.title = title;
    this.author = author;
    this.year = year;

    this.getSummary = function () {
        return `${this.title} was written by ${this.author} in ${this.year}`
    }
}

// Instatiate an Object
const book1 = new Book('Book One', 'Writer One', '2018');
const book2 = new Book('Book Two', 'Writer Two', '2019');

console.log(book1);
console.log(book2.getSummary()); 