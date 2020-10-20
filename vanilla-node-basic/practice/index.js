const http = require('http');
const url = require('url');
const { getOverviewPage, getProductPage } = require('./utils');


const server = http.createServer((req, res) => {

    const {pathname, query} = url.parse(req.url, true);
    // console.log(pathname, query);

    if((pathname === '/' || pathname === '/overview')&& req.method === 'GET') {
        getOverviewPage(res);

    } else if((pathname === '/product' && req.method === 'GET')) {
        getProductPage(res, query.id);

    } else {
        res.writeHead(404, {'Content-Type' : 'text/html'});
        res.end('<h1>Page Not Found</h1>');
    }

})

const PORT = process.env.PORT || 8000;
server.listen(PORT, '127.0.0.1', () => console.log("Server has been loaded!"));