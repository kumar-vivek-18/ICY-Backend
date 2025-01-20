import {User} from '../models/user.model.js';


export const checkUser = async (req, res) => {
  try {
    let { phoneNumber } = req.query;

    if (!phoneNumber) 
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    
     
      phoneNumber="+91"+phoneNumber;
      console.log('phoneNumber',phoneNumber);
    const existingUser = await User.findOne({ phoneNumber:phoneNumber });

    if(!existingUser) return res.status(200).json({
      success: true,
      exists: false,
      data:null
    })

    if (existingUser) 
      return res.status(200).json({
        success: true,
        exists: true,
        data:existingUser
      });
    
  } catch (error) {
    console.error("Error in checking User", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const createUser = async (req, res) => {
  try {
    const { phoneNumber, name } = req.body;
    

    if (!phoneNumber) 
      return res.status(400).json({
        success: false,
        message: "phone number is required",
      });

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const newUser = await User.create({phoneNumber:phoneNumber, name:name});
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

