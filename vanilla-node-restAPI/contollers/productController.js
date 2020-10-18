const Product = require('../models/productModel');
const { getPostData } = require('../utils');

// Get data asynchronously

// @desc : Find all products 
// @route : GET api/products
async function getProducts(req, res) {
    
    try{ 
        const products = await Product.findAll();
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify(products))

    } catch (error) {
        console.log(error);
    }
}

// @desc : Find single product
// @route : GET api/products/:id
async function getProductById(req, res, id) {

    try {
        const product = await Product.findById(id);
        if(!product) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: 'Product Not Found'}))
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end(JSON.stringify(product))
        }

    } catch (error) {
        console.log(error);
    }
}

// @desc : Create a new product
// @route : POST api/products/

async function createProduct(req, res) {
    try {
        // static test product
        // const testProduct = {
        //     name : 'Test Product',
        //     description: 'Creating a test product',
        //     price: 0.01
        // }
        const body = await getPostData(req);
        const {name, description, price} = JSON.parse(body);
       
        const product = {
            name,
            description,
            price
        }
        
        const newProduct = await Product.create(product);   
   
        res.writeHead(201, {'Content-Type': 'application/json'})
        return res.end(JSON.stringify(newProduct))

    } catch (error) {
        console.log(error);
    }
}

// @desc : Update a new product
// @route : PUT api/products/:id

async function updateProduct(req, res, id) {
    try {

        const product = await Product.findById(id);

        if(!product) {
           res.writeHead(404, {'Content-Type': 'application/json'});
           res.end(JSON.stringify({ message : 'Product Not Found'})) 
       
        } else {
            const body = await getPostData(req);
            const {name, description, price} = JSON.parse(body);
            const dataToUpdate= {
                name : name || product.name,
                description : description || product.description,
                price : price || product.price
            }
            const updatedProduct = await Product.update(id, dataToUpdate);
            res.writeHead(200, {'Content-Type' : 'application/json'});
            res.end(JSON.stringify(updatedProduct));
        }

    } catch (error) {
        console.log(error);
    }
}

// @desc : Delete a new product
// @route : DELETE api/products/:id

async function removeProduct(req, res, id) {

    const product = await Product.findById(id);

    if(!product) {
        res.writeHead(404, {'Content-Type' : 'application/json'});
        res.end(JSON.stringify({message : 'Product Not Found'}));
    } else {
        await Product.remove(id)
        res.writeHead(200, {'Content-Type' : 'application/json'});
        res.end(JSON.stringify({message: `Product ${id} has been removed`}))
    }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    removeProduct
}