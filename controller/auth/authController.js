import User from "../../model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// ---------------------Register User-------------------------------------------
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, gender } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email or phone already registered" });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      gender,
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

// -----------------------const Login User---------------------------------------

// const generateAccessToken = (user) =>
//   jwt.sign(
//     { id: user._id, email: user.email },
//     process.env.ACCESS_TOKEN_SECRET,
//     { expiresIn: "15m" },
//   );

// export const loginUser = async (req, res) => {
//   const { email, password, rememberMe } = req.body;

//   try {
//     const checkUser = await User.findOne({ email }).select("+password");
//     if (!checkUser) {
//       return res
//         .status(400)
//         .json({ success: false, message: "User does not exist" });
//     }

//     const checkPassword = await bcrypt.compare(password, checkUser.password);
//     if (!checkPassword) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid password" });
//     }

//     const accessToken = generateAccessToken(checkUser);

//     // Refresh token expiry depends on rememberMe
//     const refreshExpiry = rememberMe ? "30d" : "1d";
//     const refreshToken = jwt.sign(
//       { id: checkUser._id },
//       process.env.REFRESH_TOKEN_SECRET,
//       { expiresIn: refreshExpiry },
//     );

//     checkUser.refreshToken = refreshToken;
//     await checkUser.save();

//     const cookieOptions = {
//       httpOnly: true,
//       secure: false,
//       sameSite: "strict",
//     };

//     // Only set maxAge if rememberMe — otherwise it becomes a session cookie
//     // (browser deletes it automatically when the browser closes)
//     if (rememberMe) {
//       cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
//     }

//     res.cookie("refreshToken", refreshToken, cookieOptions).json({
//       success: true,
//       message: "User login successful",
//       accessToken,
//       user: {
//         email: checkUser.email,
//         id: checkUser._id,
//         role: checkUser.role,
//         firstName: checkUser.firstName,
//         lastName: checkUser.lastName,
//         phone: checkUser.phone,
//         gender: checkUser.gender,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };
