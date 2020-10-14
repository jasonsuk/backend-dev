class Book {
    constructor(title, author, year) {
        this.title = title,
            this.author = author,
            this.year = year
    }

    // Create method : don't need extra prototype to add
    getSummary() {
        return `${this.title} was written by ${this.author} in ${this.year}`
    }
}

// Magazine Subclass 
class Magazine extends Book {
    constructor(title, author, year, month) {
        // In order to call the parent constructor
        super(title, author, year);
        this.month = month;
    }
}

// Instantiate Magazine
const mag1 = new Magazine('Mag One', 'Writer One', '2019', 'Jan');
console.log(mag1);

console.log(mag1.getSummary());