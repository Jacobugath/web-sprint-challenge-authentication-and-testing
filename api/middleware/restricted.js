const jwt = require('jsonwebtoken');
const secret = 'jacob';

module.exports = (req, res, next) => {
console.log(req.headers.authorization)
if(!req.headers.authorization){
  res.status(401).send({message: 'token required'});
}

else{
 const token = req.headers.authorization;
 jwt.verify(token, secret, (e, dt) =>{
  if(e){
    res.status(401).send({message: 'token invalid'})
  }
  else{
    next();
  }
 })
}
  // if(req.headers.authorization == 'bad token'){
  //   res.status(401).send({message: 'token invalid'})
  // }
  // else{
  //   jwt.verify(token, secret, (e, dt) =>{
  //     if(e){
  //       res.status(401).send({token: token})
  //     }
  //   })
  // next();
  }
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
// };
