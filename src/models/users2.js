const mongoose = require("mongoose");
const { error, timeStamp } = require("node:console");

const validator=require("validator")
/**
 * for those are neccesary to fill are first name so we use required.
 * for those field that we want that it will be added default . is like points 0 for user login for new id
 * for those field which should be unique like email and phone no we use the unique:true
 */
// now there is a concept of some thing that is when user is created and .. we need a track of that thing  . lets see how to do it

const userschema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastname: {
      type: String,
      default: "yadav ",
    },
    // now we are going to write the validation for the email should be correct and valid it includes @gmail.com so we are going to use the lib is validator 

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value){
        if(!validator.isEmail(value)){
            throw new Error("this email is not valid")
        }
        if (!value.endsWith("@gmail.com")) {
            throw new Error("Only Gmail addresses are allowed");
        }
      }
    },
    phoneno: {
      type: String,
      unique: true,
      sparse:true,
       
    },
    // we can also add skills here this can be multiple then it is array of string .
    skills: {
      type: [String],
    },
    age: {
      type: Number,
      min: 18,
      max: 50,
    },
    password:{
        type:String,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Make Strong Password")
            }
        }
    },
    // now for gender It can be male female or other   does it is written in the mongoose for that validation of the gender (ans is NO ) . So now we have to make our custom Validation lets see how to make it .
    gender: {
      type: String,
      trim: true,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new error();
        }
      },
    },
  },
  {
    timestamps: true,
  },
);
const User = mongoose.model("User", userschema);
module.exports = { User };
