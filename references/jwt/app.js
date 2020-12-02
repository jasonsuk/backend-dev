const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

// FORMAT OF TOKEN ON HEADER
// Authorization: Bearer <access_token>

// Middlware @DESC : verify token before posting
const verifyToken = (req, res, next) => {
    // Get the auth header value
    // When sending a token, send it on header
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        // Set the token to pass on
        req.token = token;
    } else {
        // Forbidden
        res.sendStatus(403) // can do it with res.json({})
    }
    next();
}

app.get('/api', (req, res) => {
    res.json({
        message: 'JSON web token tuturial is in progress!'
    })
})

app.post('/api/posts', verifyToken, (req, res) => {
    // Now 
    jwt.verify(req.token, 'secretKey', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created!',
                authData
            })
        }
    }) 
})

// @ DESC: GET TOKEN
app.post('/api/login', (req, res) => {
    // Create a mock user
    // Usually, get a post request with user info (i.e. form submit)
    const mockUserPayload = {
        id: 1,
        username: 'devjson',
        email: 'devjson@gmail.com'
    }

    // Sign async 
    jwt.sign({mockUserPayload}, 'secretKey', {expiresIn : '60s'}, (err, token) => {
        res.json({
            token
        })
    })
})

app.listen(3500, () => console.log('Server started on port 3500'));