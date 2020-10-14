class Book {
    constructor(title, author, year) {
        this.title = title,
            this.author = author,
            this.year = year
    }

    // Create method
    getSummary() {
        return `${this.title} was written by ${this.author} in ${this.year}`
    }

    getAge() {
        const age = new Date().getFullYear() - this.year;
        return `${this.title} is ${age} year's old`
    }

    revise(newYear) {
        this.year = newYear;
        this.revised = true;
    }

    // Don't need to instanitate if static used
    static topBookStore() {
        return 'Bearnes & Nobles';
    }
}

// Instanitate Object
const book1 = new Book('Book One', 'Writer One', '2018');
// console.log(book1);

// book1.revise('2019');
// console.log(book1);

// book1.topBookStore(); -> no no!
console.log(Book.topBookStore());
