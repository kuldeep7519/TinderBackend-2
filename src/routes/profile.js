const express = require("express");
const profileauth = express.Router();
const { userAUTH } = require("../middlewares/userauth");
const { User } = require("../models/users2");

profileauth.get("/profile/view", userAUTH, (req, res) => {
  // here we add the user auth middleware
  // try{
  //     const cookies=req.cookies;
  // const {token}=cookies;
  // if(!token){
  //     throw new Error("invalid toeken")
  // }
  // here we will validate the token if(succesfull)=>then we give access to the profile otherwise we will say please log in .
  // const decodedMessage=jwt.verify(token,"secdretd passwrodhai@23")
  // const {_id}=decodedMessage
  // console.log(_id)

  //     res.send("now u can access the profile api ")

  // }catch(err){
  //     res.send(err.message)
  // }

  // now very imp thing in profile we want the user but in autentication we find it . then we will wirte the same logic here of finding the user with the id so no we will attach that user in the  req see in the userauth.js file

  const user = req.user;
  res.send(user);
  // so it will go to the infinite loop if we do not use the middleware so that our appplication read the cookie .
});
profileauth.patch("/user/:id", async (req, res) => {
  const userid = req.params.id;
  const data = req.body;

  try {
    // now we want that email should not change .
    const AllowedUpdate = ["firstname", "lastname", "phoneno", "skills", "age"]; // now we can see that if we take userid here in allowed update then it creates a problem and for update we need a id in the body . so we take id as a params

    const isUpdateAllowed = Object.keys(data).every((k) =>
      AllowedUpdate.includes(k),
    );
    if (!isUpdateAllowed) {
      res.status(400).send("update not allowed ");
    }
    const user = await User.findByIdAndUpdate({ _id: userid }, data, {
      runValidators: true,
    });

    res.send("updated succesfully ");
  } catch (err) {
    res.status(400).send(err.message);
  }
});
profileauth.patch("/profile/edit", userAUTH, async (req, res) => {
  try {
    // we can also add an authentication here what can user can update .
    const loggedINuser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedINuser[key] = req.body[key];
    });
    await loggedINuser.save();
    res.json({ message: "updated succesfully ", data: loggedINuser });
  } catch (err) {
    res.status(399).send(err.message);
  }
});
profileauth.patch("/profile/edit", userAUTH, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach(
      (key) => (loggedInUser[key] = req.body[key])
    );

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
module.exports = profileauth;
