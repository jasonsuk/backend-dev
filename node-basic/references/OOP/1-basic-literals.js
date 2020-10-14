// Object literals

const book1 = {
    title: 'Book One',
    author: 'Writer One',
    year: 2018,
    getSummary: function () {
        return `${this.title} was written by ${this.author} in ${this.year}`
    }
}

const book2 = {
    title: 'Book Two',
    author: 'Writer Two',
    year: 2019,
    getSummary: function () {
        return `${this.title} was written by ${this.author} in ${this.year}`
    }
}

// console.log(book1.title);
// console.log(book1.getSummary());

// console.log(Object.values(book1));
// console.log(Object.keys(book1));