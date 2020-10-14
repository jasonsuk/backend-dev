// Object of Protos
const bookProtoes = {
    getSummary: function () {
        return `${this.title} was written by ${this.author} in ${this.year}`
    },
    getAge: function () {
        const age = new Date().getFullYear() - this.year;
        return `${this.title} is ${age} year's old`
    }
}

// Create Object
const book1 = Object.create(bookProtoes);
book1.title = 'Book one';
book1.author = 'Writer one';
book1.year = '2018';

console.log(book1);
console.log(book1.getSummary());
