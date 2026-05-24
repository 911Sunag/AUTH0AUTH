const User = require('../models/User.js');
const bcrypt = require('bcryptjs');

const generateToken = require('../utils/generateToken.js');

//register user controller

const registerUser = async (req, res) => {
    try{
        const { name, email, password } = req.body;

        const userExistes = await User.findOne({ email });

        if(userExistes){
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = generateToken(user._id, user.role);

        res.cookie('token', token, {
            httpOnly:true,
            secure:false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            message: 'user registered successfully',
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        })
    } catch (error) {
       res.status(500).json({
        message:error.message,
       });
    } 
};

// user or admin login controller

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user._id, user.role);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// logout controller


const logoutUser = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    message: 'Logged out successfully',
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};