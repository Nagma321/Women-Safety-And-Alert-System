import User from "../Models/UserModel.js";
import bcrypt from "bcryptjs";
import CreateToken from "../Utils/CreateToken.js";
import { OAuth2Client } from 'google-auth-library';
import jwt from "jsonwebtoken";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const Signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please enter all the fields" });
  }

  const emailExits = await User.findOne({ email });
  if (emailExits) {
    return res.status(409).json({ message: "Email already exists" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const NewUser = await new User({
      username,
      email,
      password: hashedPassword,
      isGoogleUser: false
    });

    if (NewUser) {
      await NewUser.save();

      const token = CreateToken(NewUser._id);
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "none"
      })
        .status(200).json({
          _id: NewUser._id,
          email: NewUser.email,
          profilephoto: NewUser.profilePhoto,
          reviews: NewUser.reviews,
          contacts: NewUser.contacts
        });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred during signup" });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;

  const exitsEmail = await User.findOne({ email });

  if (!exitsEmail || exitsEmail.isGoogleUser) {
    return res.status(401).json({ message: `${!exitsEmail ? "No User Found" : "This email is already registered with a different login method"}` });
  } else {
    const comparePassword = await bcrypt.compare(password, exitsEmail.password);
    if (comparePassword) {
      const token = CreateToken(exitsEmail._id);
      // console.log(token)

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "none"
      })
        .status(200).json({
          _id: exitsEmail._id,
          email: exitsEmail.email,
          profilephoto: exitsEmail.profilePhoto,
          reviews: exitsEmail.reviews,
          contacts: exitsEmail.contacts
        });
    } else {
      res.status(409).json({ message: "Invalid Credentials" });
    }
  }
};

const Logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      expiresIn: new Date(0),
      sameSite: "none",
      secure: true
    }).json({ message: "Logout Successfully" });
  } catch (error) {
    res.status(400).json({ message: "Logout Unsuccessful" });
  }
};

const GoogleAuthController = async (req, res) => {
  try {
    const { email, name, googleId, picture } = req.body;


    let existingUser = await User.findOne({ email });

    if (existingUser) {

      if (!existingUser.isGoogleUser) {
        return res.status(400).json({
          message: "This email is already registered with a different login method"
        });
      }


      existingUser.googleId = googleId;
      if (picture) {
        existingUser.profilePhoto = picture;
      }
      await existingUser.save();

      const token = CreateToken(existingUser._id);

      return res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "none"
      }).status(200).json({
        _id: existingUser._id,
        email: existingUser.email,
        profilephoto: existingUser.profilePhoto,
        reviews: existingUser.reviews,
        contacts: existingUser.contacts

      });
    }


    const newUser = await User.create({
      username: name,
      email,
      googleId,
      profilePhoto: picture || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvFbJHIvlkPWSvsJ1rWRbr64ZPiCCdb1SCLg&s",
      isGoogleUser: true,
      reviews: [],
      contacts: []
    });

    const token = CreateToken(newUser._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "none"
    }).status(200).json({
      _id: newUser._id,
      email: newUser.email,
      profilephoto: newUser.profilePhoto,
      reviews: newUser.reviews,
      contacts: newUser.contacts
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      message: "An error occurred during Google authentication"
    });
  }
};

const Authentication = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ authenticated: false, message: 'Token missing!' });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userData = await User.findById(decoded.id);
    if (!userData) {
      return res.status(404).json({ authenticated: false, message: 'User not found!' });
    }

    //console.log("Authenticated User:", userData);


    return res.status(200).json({
      authenticated: true,
      user: {
        id: userData._id,
        email: userData.email,
      },
    });

  } catch (error) {
    console.error('Authentication error:', error.message);

    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ authenticated: false, message: 'Invalid or expired token!' });
    }

    return res.status(500).json({ authenticated: false, message: 'Server error!' });
  }
};

const GetUserInfo = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No User Found" });
    }

    res.status(200).json({
      _id: user._id,
      email: user.email,
      username: user.username,
      profilePhoto: user.profilePhoto,
      reviews: user.reviews,
      contacts: user.contacts,
      isGoogleUser: user.isGoogleUser
    });
  } catch (error) {
    console.error("Error fetching user data:", error); // Log error for debugging
    res.status(500).json({ message: "An error occurred during data retrieval" });
  }
};



export { Signup, Login, Logout, GoogleAuthController, Authentication, GetUserInfo };