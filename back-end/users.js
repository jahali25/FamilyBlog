const express = require("express");
const mongoose = require('mongoose');
const argon2 = require("argon2");

const router = express.Router();

//
// User schema and model
//

// This is the schema. Users have usernames and passwords. We solemnly promise to
// salt and hash the password!
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    bio: {
      type: String,
      default: ""
    },
    username: String,
    password: String,
    iconPath: String,
    role: {
        type: String,
        default: ""
    },
});

userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

userSchema.set('toJSON', {
  virtuals: true
});

// This is a hook that will be called before a user record is saved,
// allowing us to be sure to salt and hash the password first.
userSchema.pre('save', async function(next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password'))
    return next();

  try {
    // generate a hash. argon2 does the salting and hashing for us
    const hash = await argon2.hash(this.password);
    // override the plaintext password with the hashed one
    this.password = hash;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// This is a method that we can call on User objects to compare the hash of the
// password the browser sends with the has of the user's true password stored in
// the database.
userSchema.methods.comparePassword = async function(password) {
  try {
    // note that we supply the hash stored in the database (first argument) and
    // the plaintext password. argon2 will do the hashing and salting and
    // comparison for us.
    const isMatch = await argon2.verify(this.password, password);
    return isMatch;
  } catch (error) {
    return false;
  }
};

// This is a method that will be called automatically any time we convert a user
// object to JSON. It deletes the password hash from the object. This ensures
// that we never send password hashes over our API, to avoid giving away
// anything to an attacker.
userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
}

// create a User model from the User schema
const User = mongoose.model('User', userSchema);

/* Middleware */

// middleware function to check for logged-in users
const validUser = async (req, res, next) => {
  if (!req.session.userID)
    return res.status(403).send({
      message: "not logged in"
    });
  try {
    const user = await User.findOne({
      _id: req.session.userID
    });
    if (!user) {
      return res.status(403).send({
        message: "not logged in"
      });
    }
    // set the user field in the request
    req.user = user;
  } catch (error) {
    // Return an error if user does not exist.
    return res.status(403).send({
      message: "not logged in"
    });
  }

  // if everything succeeds, move to the next middleware
  next();
};

/* API Endpoints */

/* All of these endpoints start with "/" here, but will be configured by the
   module that imports this one to use a complete path, such as "/api/user" */

// create a new user
router.post('/', async (req, res) => {
  // Make sure that the form coming from the browser includes all required fields,
  // otherwise return an error. A 400 error means the request was
  // malformed.
  if (!req.body.firstName || !req.body.lastName || !req.body.username
    || !req.body.password || !req.body.iconPath) {
    return res.status(400).send({
      message: "first name, last name, username and password are required"
    });
  }
  try {
    //  Check to see if username already exists and if not send a 403 error. A 403
    // error means permission denied.
    const existingUser = await User.findOne({
      username: req.body.username
    });
    if (existingUser) {
      return res.status(403).send({
        message: "username already exists"
      });
    }

    let user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.password,
      iconPath: req.body.iconPath,
    });
    // Adding a bio is optional
    if (req.body.bio) {
      user.bio = req.body.bio;
    }
    await user.save();
    // set user session info
    req.session.userID = user._id;

    // send back a 200 OK response, along with the user that was created
    return res.send({
      user: user
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// login a user
router.post('/login', async (req, res) => {
  // Make sure that the form coming from the browser includes a username and a
  // password, otherwise return an error.
  if (!req.body.username || !req.body.password)
    return res.sendStatus(400);

  try {
    //  lookup user record
    const user = await User.findOne({
      username: req.body.username
    });
    // Return an error if user does not exist.
    if (!user)
      return res.status(403).send({
        message: "username or password is wrong"
      });

    // Return the SAME error if the password is wrong. This ensure we don't
    // leak any information about which users exist.
    if (!await user.comparePassword(req.body.password))
      return res.status(403).send({
        message: "username or password is wrong"
      });

    // set user session info
    req.session.userID = user._id;

    return res.send({
      user: user
    });

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get logged in user
router.get('/', validUser, async (req, res) => {
  try {
    res.send({
      user: req.user
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// logout
router.delete("/", validUser, async (req, res) => {
  try {
    req.session = null;
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// This will change the user info but not the password or the role
// Those will be a different functions
router.put("/", validUser, async (req, res) => {
  try {
    let user = req.user;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.bio = req.body.bio;
    user.iconPath = req.body.iconPath;
    await user.save();
    req.session.userID = user._id;
    res.send({
      user: user
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// This will change the user's password, but only the password
router.put("/password", validUser, async (req, res) => {
  try {
    let user = req.user;
    user.password = req.body.password;
    await user.save();
    res.status(200).send({
      message: "Password was changed"
    });
  } catch (error) {
    console.log(error);
    return res.status(403).send({
      message: "Unable to update password"
    });
  }
});

// This will allow administrators to be able to make other users

router.put("/promote/:userID", validUser, async (req, res) => {
  // can only do this if an administrator
  if (req.user.role !== "admin") {
    return res.sendStatus(403);
  }

  try {
    user = await User.findOne({
      _id: req.params.userID
    });
    user.role = "admin";
    await user.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// This will allow administrators to ban users that are not also administrators
// This will make it so that banned users cannot post comments or new blog posts
router.put("/ban/:userID", validUser, async (req, res) => {
  // can only do this if an administrator
  if (req.user.role !== "admin") {
    console.log("You're not an admin!");
    return res.sendStatus(403);
  }
  try {
    user = await User.findOne({
      _id: req.params.userID
    });
    if (!user) {
      console.log("Couldn't find the user");
      return res.sendStatus(403);
    }
    if (user.role === "admin") {
      console.log("!" + user.role + "!");
      console.log(user);
      console.log("They are an admin");

      return res.sendStatus(403);
    }
    user.role = "banned";
    await user.save();
    res.sendStatus(200);
  } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});

// This gives back a list of all users, but only if one is signed in and not
// banned.
router.get("/all", validUser, async (req, res) => {
  if (req.user.role === "banned") {
    return res.sendStatus(403);
  }
  try {
    users = await User.find();
    return res.send({
      users: users
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
})

module.exports = {
  routes: router,
  model: User,
  valid: validUser
};
