const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//Import Routes
const authRoute = require('./Routes/auth');
const postRoute = require('./Routes/posts');

dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT, 
    {   useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    },
    () => console.log('connected to db'));

//Middleware
app.use(express.json());



//Route Middlewares
app.use('/', authRoute);
app.use('/', postRoute);


app.listen(3000, () => console.log('Server Is Up & Running'));

