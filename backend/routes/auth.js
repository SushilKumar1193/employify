const express = require('express');
const User = require('../models/User');
const  StatusCodes = require('http-status-codes')
const {BadRequestError, UnauthenticatedError } = require('../errors/index.js')
const { body, validationResult } = require('express-validator');
const router = express.Router();
var bcrypt = require('bcryptjs');
const JWT_SECRET = '$u$h!lkum^r'
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/authentication')


router.post('/register' , [
  body('name','Enter a valid name').isLength({ min: 5 }),
  body('email','Enter a valid email').isEmail(),
  body('password').isLength({ min: 5 })
] ,async(req,res)=>{

  // if there are errors , return bad request and error messages
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
	return res.status(400).json({ errors: errors.array() });
  }
	const { name,email, password } = req.body

  if (!email || !password || !name) {
    throw new BadRequestError('Please provide all values')
  }
  const salt =await bcrypt.genSalt(10);
	const secPass =await bcrypt.hash(req.body.password,salt)
  // const user = await User.create({ ...req.body })

  const user = await User.create({
	name: req.body.name,
	email: req.body.email,
	password: secPass
  })

  const data = {
	user:{
		id: user.id
	}
}

  const token = jwt.sign(data , JWT_SECRET);
  await res.json({
    user: {
		// id: user.id
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },
    token: token,
    location: user.location,
  })
  // res.json({user});
})

// login

router.post('/login', [
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists()

] ,async (req,res)=>{
    // let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email,password} = req.body;

    try {
    let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "Please try to login using correct credentials"});
        }
        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            // success=false;
        return res.status(400).json({error: "Please try to login using correct credentials"});
        }
        const data = {
            user:{
                id: user.id
            }
        }
    
        const authtoken = jwt.sign(data , JWT_SECRET);
        // success=true;
        // res.json({authtoken})
        await res.json({
          user: {
          // id: user.id
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name,
          },
          token: authtoken,
          location: user.location,
        })
        }
     catch(error){ 
        console.log(error.message)
        res.status(500).send("Some errors occurred");
    }

})


//update
router.patch('/updateUser',fetchuser,async (req, res) => {
	const { email, name, lastName, location } = req.body
	if (!email || !name) {
	  throw new BadRequestError('Please provide all values')
	}
	const userId=req.user.id;
	// const user = await User.findOne({ _id: req.user.id })
    const user = await User.findById(userId).select("-password")
    console.log(user);
  
	user.email = email
	user.name = name
	user.lastName = lastName
	user.location = location
  
	await user.save()
	const data = {
		user:{
			id: user.id
		}
	}
	const token = jwt.sign(data , JWT_SECRET);

	res.status(StatusCodes.OK).json({
	  user: {
		email: user.email,
		lastName: user.lastName,
		location: user.location,
		name: user.name,
	  },
	  token,
	  location: user.location,
	})
})

module.exports=router;