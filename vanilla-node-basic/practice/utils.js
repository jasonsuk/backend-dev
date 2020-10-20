const fs = require('fs');
const path = require('path');

// READ JSON FILE SYNC
const data = fs.readFileSync(path.join(__dirname, 'data', 'data.json'), 'utf-8');
const dataObj = JSON.parse(data);

// LOAD CARD TEMPLATE
const cardTemp = fs.readFileSync(path.join(__dirname,'templates','cards-template.html'), 'utf-8');

// UPDATE TEMPLATE WITH DATA
function updateTemplate(product, temp) {
    let output = temp.replace(/{%ID%}/g, product.id);
    output = output.replace(/{%PRODUCT_NAME%}/g,product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%ORIGIN%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%DESC%}/g, product.description);

    if(!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    }
    return output
}

// UPDATE TEMPLATE AND LOAD OVERVIEW PAGE
function getOverviewPage(res) {

    fs.readFile(path.join(__dirname, 'templates', 'overview-template.html'), 'utf-8', (err, temp) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, {'Content-Type' : 'text/html'});
                res.end('<h1>Page Not Found</h1>');
            } else {
                res.writeHead(500, {'Content-Type' : 'text/html'});
                res.end('Server error', err.code);
            }

        } else {
            const templateUpdated = dataObj.map((data, index) => {
                return updateTemplate(data, cardTemp)
            })
            
            const overviewHTML = temp.replace(/{%PRODUCT_CARDS%}/g, templateUpdated.join(','));

            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.end(overviewHTML);
        }

    })

}

// UPDATE TEMPLATE AND LOAD PRODUCT PAGE
function getProductPage(res, id) {

    fs.readFile(path.join(__dirname, 'templates', 'product-template.html'), 'utf-8', (err, temp) => {

        if (err) {     
            if(err.code === 'ENOENT') {
                res.writeHead(404, {'Content-Type' : 'text/html'});
                res.end('<h1>Page Not Found</h1>');
            } else {
                res.writeHead(500, {'Content-Type' : 'text/html'});
                res.end('Server error', err.code);
            }
        } else {

            const product = dataObj[id];
            const productHTML = updateTemplate(product, temp);

            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.end(productHTML);
        }

    });

}


module.exports = {
    getOverviewPage,
    getProductPage
}








