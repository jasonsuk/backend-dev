const express = require('express')
const dotenv = require('dotenv')

// Load env variables
dotenv.config({ path: './config/config.env' })

const app = express()

const PORT = process.env.PORT || 5500
app.listen(PORT, () =>
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`
    )
)
