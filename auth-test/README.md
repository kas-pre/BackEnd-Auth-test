Creating a REST API with authentication
-Storing Users in the databse
-Hashing passwords
-JSON web tokens
-Private Routes

npm init
dependencies
-express - for creating & handling our routes 
-nodemon - for restarting our server
-joi for validation
-bcryptjs - harshing password
-jsonwebtoken


create index.js file as our entry point
create Routes
Connect Databse
Create model
-jwt token; requests- tokens authenticate requests, eg to know u are logged in each time u make a request 

We are going to create a REST API with authentication

We are going to look at alot of things, such as how to store users in the database, hashing passwords, utilizing json web tokens, for authentication purposes, creating private routes

The first thing is to have Nodejs installed

Initialise our project through npm init & this should provide us with a package.json which holds all of our packages, most of which we shall install when need arises

To begin with, we are going to install the express package, which is basically going to handle our routes for us

We are aloso going to install nodemon, which is just going to always restart the server for us, make our development process quite easy npm --save-dev; install as a dev-dependency

We are going to create our entry file, which in this case, we already have as app.js

Once express is installed, we can initiate our first server.

Using const express = require('express); & terminate the statement

Initialize a variable app = express(); & invoke the function

To start up the server, is use app.listen(3000, () => console.log('Server is UP & Running'));, give it a port, & a callback function that shows to us when the server begins working

We are now going to create our routes, recommendendly, in a folder dedicated for handling routes.

We are going to create a new file, auth.js, whihc will contain our authentication routes.

Once this is done, first thing we are going to do is to create a router;
const router = require(''express).Router();

We are going to make it available for use in the other files; imported as middleware into the entry file, forexample by using;
module.exports = router;

Let us begin with an empty router, which will be used for user registration

router.post('/api/user/register', async (req, res) => {
    res.send('Register')
});

Lets return to app.js & first add a comment that shows where routes we are importing into our application are going to be
//Import Routes
const authRoute = require('./Routes/auth.js');

We can then create some route middleware
//Route middleware
app.use('/api/user', authRoute); //Everything in the auth route is going to have the prefix /api/user;- so that forexample when we do a post request to /register, its basically /api/user/register

To start our application we can run npm start, & since we already have nodemon installed, it will automatically begin to start our server continuously each time we make some changes to our code

Let us open up postman, which should help us to work with our API requests
that we are going to be looking at. We can start from creating a request, input the request URL, & make sure to specify the request type, forexample to begin with, for our /register post request, & click on send.
It should return a response for us in the body

Lets connect to a database so that we can be able to do registration of our users, & several other functionalities

To connect to a database, we can set up our mongodb servers, start up mongodb campus, & run or local databse or utilize mongodb atlas, so that we can have our database available from the cloud

In the cloud(mongodb cluster), we can create a cluster, provide access(security & network) & connect, with our application

Next, we need to connect our mongodb database to our server, using the mongoose package.
npm install mongoose
require mongoose
use mongoose.connect,
//error handling alt. arrow function. Remember the flags too
db.on
db.once

When using mongoose.connect, we need to pass in the url for our database; either locally or provided by atlas. But usually, this involves exposing certain explicit information such as the password, expecially when we use mongodb atlas. To counter this, we can move this url, & hide it somewhere, but to make it accessible, we are gonna install a package dotenv, which is gonna help us do this well. We can create an environment variable using dotenv & store the password in there, so that when we push our code to github or heroku, we just inject in the environemt variable, eg when using heroku, which provides a dashboard where you can add it

Once dotenv is installed, all we have to do, is to  create a new file on the root; .env & we can add a DB_CONNECT = (copy the string for the db url)

We need to import the dotenv also const dotenv = require('dotenv');

To initiate it & make everything work, just need to say dotenv.config(); within our app.js

Once we have the dotenv configed, to access everything in the .env file, all we have to do is say process.env.(name provided in the file).

We need to create a model(User) of how our data is going to look like, using the mongoose package too & for simplicity purposes, we can model our user data to have the username, email-address & password. You can add more but we can begin with this for demo purposes. We can do this in the models folder, create a User.js

We can import mongooose
Then create a schema, which basically represents a model for our user
const userSchema = new mongoose.Schema({ //this is an object
we can define properties that we want to have
    name: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    date: {
        type: Date,
        default: Date.now
    }
});

//To make our model available
module.exports = mongoose.model('User', userSchema);
We can use this to add & login our users, using the properties above

We can import our User model, that we just made, into our auth.js
const User = require('./Models/User.js');
So we now have access to the user

Let us try to make a requst, using the User model that we made
router.post('/api/user/register', async (req, res) => {
    const user = new User({ //Pass in the data we want to submit
        name: req.body.name, //where the data is going to come from(comes from the json body response, when we pass our request in postman)
        email: req.body.email,
        password: hashedPassword //req.body.password
});

But to be able to read our data from postman, when we post, we must use a bodyparser, in app.js
//As Middleware
app.use(express.json());
Now we can send our post requests

After creating the new user, we need to save the user, using an async call, since we need some time as we submit data to the database; down we can add a try, catch; try to submit a  user, catch an errror, in case it is there, by responding with a 400 status code, & then we can send the error back. In our try, we can try to save the user, and we can as well send a response, showing our saved user. Let's try this out in Postman.
<!-- Body; content-type; application/json
name
email
password --> It generates everything. We can as well check the databse to find if our user was saved.

try{
        const savedUser = await user.save();
        res.send({user: user._id});
    }catch(err){
        res.status(400).send(err);
    }
});


We shouldnt store our passwords, aa plain as they are, & we should do validation of the data submitted

So let us consider how we can validate user data, as well as how we can hash passwords

To validate our information that we are getting from the user, we can use the Joi package; npm install @hapi/joi //alt 'joi'

Once install is done, we can create a file on the root directory validation.js that is going to handle our validation. In validation.js we need to import Joi; 
const Joi = require('@hapi/joi');

We previously created a schema with what kind of info we have in our user, we can create a schema here as well, with validation
const schema = Joi.object().keys({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

Therefore, before we submiit everything, we can validate the response we can get from the user
//Register validation
const registerValidation = (data) => {
    const schema = Joi.object().keys({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    //Let's validate the data before we add a user
    return schema.validate(data);
}
module.exports.registerValidation = registerValidation; //we are doing this, in this way because we are going to have another one, but for login validation below

<!-- //In auth.js let us add register validation before creating the user -->

router.post('/api/user/register', async (req, res) => {
    // //Let's validate the data before we add a user
    // const { error} = schema.validate(req.body); //we are interested in the error
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword //req.body.password
    });
    try{
        const savedUser = await user.save();
        res.send({user: user._id});
    }catch(err){
        res.status(400).send(err);
    }
});

We will do the same for login validation; complete
//Validation
const Joi = require('joi');
//Register Validation
const registerValidation = (data) => {
    const schema = Joi.object().keys({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    //Let's validate the data before we add a user
    return schema.validate(data);
}
<!-- HERE -->
const loginValidation = (data) => {
    const schema = Joi.object().keys({
        <!-- //name: Joi.string().min(6).required(), Not interested in this on login since we already have it -->
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    //Let's validate the data before we add a user
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;

To use the validations, we are going to auth.js
const { registerValidation, loginValidation} = require('../validation')

Now let us turn to another issue
We need to make sure that when we register a user, we don't do so again with the same email. We dont want to have two matching identical emails in the database
In auth.js
After validating data we get from the user
We check if user is already in the database
//Checking if user is already in the database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

router.post('/api/user/register', async (req, res) => {
    // //Let's validate the data before we add a user
    // const { error} = schema.validate(req.body);
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    <!-- added -->
    //Checking if user is already in the database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    //create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword // req.body.password
    });
    try{
        const savedUser = await user.save();
        res.send({user: user._id});
    }catch(err){
        res.status(400).send(err);
    }
});

The next problem to handle, is the blank password(a very big problem), we need to avoid by hashing it, so that only the user knows the passwors, & the system only provides a sort of hash encryption
To do this, we are going to use the bcryptjs package, which is going to do just that. its gonna take the password, throw an algorithm, and change the password, add different characters & make it a mess, & we can't tell what our password is only bcrypt can.
npm install bcryptjs
import bcryptjs in auth.js
const bcrypt = require('bcryptjs')

After checking if user is already in the database, next we hash the password
We are gonna generate a salt; a mess of a string that is more secure than the blank password. Then create a hashed password. salt & password combine; Generate a salt, hash the password with the salt

//Hash the passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

So instead of a blank password, we can instead add a hashed password
router.post('/api/user/register', async (req, res) => {
    // //Let's validate the data before we add a user
    // const { error} = schema.validate(req.body);
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if user is already in the database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    <!-- Added -->
    //Hash the passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


    //create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send({user: user._id});
    }catch(err){
        res.status(400).send(err);
    }
});

Now we hashed password, saved the user.

We can now go on to the login process
First create a new user
Then in auth.js

//Login
router.post('/api/user/login', async (req, res) => {
    // //Let's validate the data before we add a user
    // const { error} = schema.validate(req.body);
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //Checking if email exists / doesnt exist
    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Email is not found');
    //password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password')

    //res.send('Login successful');
});

Let's take a look at this in postman; check validation & login

The last step, would be to add a JWT
When we make requests, login, make posts, the only way to be sure i'm still logged in, is by utilizing a token, in this case JWT. A little token that remembers that you are logged in. Right after we validate our password & we are logged in, we can then add in our token

npm install jsonwebtoken
In auth.js
Requre jsonwebtoken
const bcrypt = require('bcryptjs')

//Login
router.post('/api/user/login', async (req, res) => {
    // //Let's validate the data before we add a user
    // const { error} = schema.validate(req.body);
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //Checking if email exists
    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Email is not found');
    //password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password')
    <!-- Added -->
    //Create & assign a token
    //Pass in some user data eg id which we can get when user is loggen in,  then, the secret token, which we can store in .env 
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token, token').send(token); //add auth-token to our header

    //res.send('Login successful');
});

we can try this out in postman, once we get the toke, we can go to jwt.io, paste in our toke, which returns payload & some data. play around with tokens

Next private routes
Create a new file verifyToken.js
Require jwt
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied');

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    }catch(err) {
        res.status(400).send('Invalid Token');
    }
}    
To make route private, we first require verifyToken, & pass it in as a handler function
let us create a simple private route
const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/api/posts', verify, (req, res) => {
    res.json({posts: {
                title: 'my first post', 
                description: 'random data you shouldnt access'
            }
        });
});

module.exports = router;

Let us check it out - login user, get token, add token in header; auth-token , give it value of the logged in user

Finally, complete project
app.js
routes
models
validation
.env
package.json

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

//Authentication routes
const router = require('express').Router();
const User = require('../Models/User');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { registerValidation, loginValidation} = require('../validation')


router.post('/api/user/register', async (req, res) => {
    // //Let's validate the data before we add a user
    // const { error} = schema.validate(req.body);
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if user is already in the database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    //Hash the passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


    //create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send({user: user._id});
    }catch(err){
        res.status(400).send(err);
    }
});

//Login
router.post('/api/user/login', async (req, res) => {
    // //Let's validate the data before we add a user
    // const { error} = schema.validate(req.body);
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //Checking if email exists
    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Email is not found');
    //password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password')

    //Create & assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token, token').send(token);

    //res.send('Login successful');
});


module.exports = router;

//Validation
const Joi = require('joi');
//Register Validation
const registerValidation = (data) => {
    const schema = Joi.object().keys({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    //Let's validate the data before we add a user
    return schema.validate(data);
}

const loginValidation = (data) => {
    const schema = Joi.object().keys({
        //name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    //Let's validate the data before we add a user
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;

const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied');

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    }catch(err) {
        res.status(400).send('Invalid Token');
    }
}    

DB_CONNECT = mongodb+srv://kp:RnuITHLHuPqvyldp@cluster0.xf9p3.mongodb.net/test?retryWrites=true&w=majority
TOKEN_SECRET = jhfshvfnkjkjf 

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);

{
  "name": "auth-test",
  "version": "1.0.0",
  "description": "Creating a REST API with authentication\r -Storing Users in the databse\r -Hashing passwords\r -JSON web tokens\r -Private Routes",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@hapi/joi": "^17.1.1",
    "bcryptjs": "^2.4.3",
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "joi": "^17.3.0",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^5.10.14"
  },
  "devDependencies": {
    "nodemon": "^2.0.6"
  }
}


const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/api/posts', verify, (req, res) => {
    res.json({posts: {
                title: 'my first post', 
                description: 'random data you shouldnt access'
            }
        });
});

module.exports = router;