const { readFileSync } = require('fs');
const http = require('http');
const url = require('url');

// Load JSON data sync
const data = readFileSync(`${__dirname}/dev-data/data.json`);
const dataObj = JSON.parse(data);
// console.log(dataObj);

// Load teampltes sync
const tempCard = readFileSync(`${__dirname}/templates/cards-template.html`, 'utf-8');
const tempOverview = readFileSync(`${__dirname}/templates/overview-template.html`, 'utf-8');
const tempProduct = readFileSync(`${__dirname}/templates/product-template.html`, 'utf-8');

// replace template with JSON data
function replaceTemplate(data, temp) {
    let output = temp.replace(/{%ID%}/g, data.id);
    output = output.replace(/{%PRODUCT_NAME%}/g, data.productName);
    output = output.replace(/{%IMAGE%}/g, data.image);
    output = output.replace(/{%ORIGIN%}/g, data.from);
    output = output.replace(/{%NUTRIENTS%}/g, data.nutrients);
    output = output.replace(/{%QUANTITY%}/g, data.quantity);
    output = output.replace(/{%PRICE%}/g, data.price);
    output = output.replace(/{%DESC%}/g, data.description);

    if(!data.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
    }

    return output
}

// create server
const server = http.createServer((req, res) => {
    try {
        const {query, pathname} = url.parse(req.url, true);
        // console.log(query.id, pathname);

        if(pathname === '/' || pathname === '/overview' && req.method === 'GET') {
            
            // completes cards-template.html with the existing data and returns it 
            const productCards = dataObj.map((productData) => {
                return replaceTemplate(productData, tempCard);
            })
            // update the overview-template.html with productCards
            const overviewHTML = tempOverview.replace(/{%PRODUCT_CARDS%}/, productCards.join(','))
        
            res.writeHead(200, {'Content-Type': 'text.html'})
            res.end(overviewHTML)

        } else if (pathname === '/product' && req.method === 'GET'){
            
            const productData = dataObj[query.id];
            const productHTML = replaceTemplate(productData, tempProduct)

            res.writeHead(200, {'Content-Type': 'text.html'})
            res.end(productHTML)
            
        } else if (pathname === '/api' && req.method === 'GET'){
            
            res.writeHead(200, {'Content-Type': 'application.json'})
            res.end(data)
            
        } else {
            res.writeHead(404, {'Content-Type':'text/html'})
            res.end('<h1>Page Not Found</h1>')
        }

    } catch (error) {
        console.log(error);
    }
})


const PORT = process.env.PORT || 8000;
server.listen(PORT, '127.0.0.1', () => console.log("Server has been loaded on PORT ", PORT));