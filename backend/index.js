const express = require('express');
const cors = require('cors');
const app = express()
const port = 5000;


app.use(express.json())
app.use(cors(
    {
        origin: 'http://localhost:3000',
        methods: ['GET'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }
))

app.get('/', (req,res) => {
    res.send('Hello World')
})

app.listen(
    port,
    () => console.log("App is running!")
)