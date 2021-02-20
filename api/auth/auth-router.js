const express = require('express');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
router.use(express.json());
const bcrypt = require('bcryptjs');

const {
    get,
    getByUsername,
    insert,
} = require('./auth-model');

router.post('/register', (req, res) => {
  if (!req.body.password||!req.body.username){
    res.status(401).send({message: 'username and password required'})
  }
  else{
  const hash = bcrypt.hashSync(req.body.password, 2);
  req.body.password = hash;
  insert(req.body).then(a => res.send(a)).catch(e => res.status(409).send({message: 'username taken'}));
  }
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', (req, res) => {
  if(!req.body.password||!req.body.username){
    res.status(401).send({message:'username and password required'});
  }
  else{
  getByUsername(req.body.username).then(user =>{

    if(!user){
      res.status(401).send({message:'invalid credentials'});
    }
    else if(user && bcrypt.compareSync(req.body.password,user.password)){
        req.session.user = user;
        const token = generateToken(user);
        req.session.token = token;
        res.status(200).json({
            message: `Welcome ${user.username}!`,
            token: token
          });
    }
    else{
        res.status(401).send({message: 'invalid credentials'})
    }
})
.catch(err => {
    res.status(401).send({message: 'invalid credentials'})
    console.log("error in post",err);

})

function generateToken(user) {
  const payload = {
    subject: user.id, // sub in payload is what the token is about
    username: user.username,
    // ...otherData
  };

  const options = {
    expiresIn: '1d', // show other available options in the library's documentation
  };

  // extract the secret away so it can be required and used where needed
  const secret = 'jacob';
  console.log('sending token');
  return jwt.sign(payload, secret, options); // this method is synchronous
}
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
  }
});

module.exports = router;
