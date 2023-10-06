import UserModel  from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import LanguageModel from "../models/Language.js";

class UserController{

    static login = (req, res) => {
        const message = req.session.message;
        console.log("checking login details ====");
        // Clear the message from the session to display it only once
        delete req.session.message;
        res.render("login", { message });
    }

    static registration = async (req, res) => {
        const message = req.session.message;
        delete req.session.message;
        const langauges = await LanguageModel.find();
        
        res.render("register", { message, langauges });
    }

    static dashboard = async (req, res) => {
        let page_title = "Dashboard Page";
        let user = await UserModel.findById(req.session.userId);
        console.log(user);
        console.log("== user value ====");
        res.render("dashboard", {page_title, user});
    }

    static logout = (req, res) => {
        req.session.destroy((err) => {
            if (err) {
              console.error('Error destroying session:', err);
            }
            res.redirect('/login'); // Redirect to the login page after logout
        });
    }

    static userRegistration = async (req, res) => {
        const {first_name, last_name, email, password, password_confirmation, language, gender} = req.body;
        const user = await UserModel.findOne({email:email});
        if(user){
            res.send({"status":"failed", "message":"Email already exists"});
        }else{
            if(first_name && last_name && email && password && password_confirmation && language && gender){
                if(password === password_confirmation){

                    try {
                        const salt = await bcrypt.genSalt(10);
                        const hashPassword = await bcrypt.hash(password, salt);
                        const doc = new UserModel({
                            firstName:first_name,
                            lastName:last_name,
                            email:email, 
                            password:hashPassword, 
                            preferredLang:language,
                            gender:gender,
                            role:'speaker',
                        });
                        await doc.save();
                        const saved_user = await UserModel.findOne({email:email});
                        // Generate JWT Token 
                        const token = jwt.sign({userId: saved_user._id}, process.env.JWT_SECERT_KEY, {expiresIn: '5d'})
                        // res.status(201).send({"status":"success", "message": "Register successfully.", "token": token})
                        req.session.userId = doc._id;
                        req.session.email = email;
                        // req.session.password = password;
                        res.redirect("/dashboard");
                    } catch (error) {
                        console.log(error);
                        // res.send({"status":"failed", "message": "Unable to register."});
                        req.session.message = 'Unable to register.';
                        res.redirect('/register');
                    }

                  
                }else{  
                    // res.send({"status":"failed", "message": "Confirmation password does not match."})
                    req.session.message = 'Confirmation password does not match.';
                    res.redirect('/register');
                }
            }else{
                req.session.message = 'All fields are required.';
                res.redirect('/register');
            }
        }
    }

    static userLogin = async (req, res) =>{
        try {
            console.log(req.body);
            const {email, password} = req.body;
            const result = await UserModel.findOne({email:email});
            console.log(email);
            console.log("no result ----");
            console.log(result);
            if(result != null){
                const isMatch = await bcrypt.compare(password, result.password);
                console.log("matching password");
                console.log(isMatch);
                if(result.email == email && isMatch){
                    console.log("you are in ---");
                    // Generate JWT Token 
                    const token = jwt.sign({userId: result._id}, process.env.JWT_SECERT_KEY, {expiresIn: '5d'})
                    // res.status(201).send({"status":"success", "message": "Login successfully.", "token": token});
                    req.session.userId = result._id;
                    req.session.email = email;
                    // req.session.password = password;
                    res.redirect("/dashboard");
                }else{
                    // res.status(201).send({"status":"failed", "message": "Email or Password not valid."});
                    req.session.message = 'Email or Password not valid.';
                    res.redirect('/login');
                }
            }else{
                // res.status(201).send({"status":"failed", "message": "You are not register user."});
                req.session.message = 'You are not a registered user.';
                res.redirect('/login');
            }
        } catch (error) {
            res.send({"status":"failed", "message": "All fields are required."})
        }
    }

    static changeUserPassword = async(req, res)=>{
        const {password, password_confirmation} = req.body;
        if(password && password_confirmation){
            if(password !== password_confirmation){
                res.send({"status":"failed", "message": "New Password and confirm password does not match"});
            }else{
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password, salt);
            }
        }else{
            res.send({"status":"failed", "message": "All fields are required."})
        }
    }

    static loggedUser = async (req, res) => {
        res.send({ "user": req.user })
      }

      static sendUserPasswordResetEmail = async (req, res) => {
        const { email } = req.body
        if (email) {
          const user = await UserModel.findOne({ email: email })
          if (user) {
            const secret = user._id + process.env.JWT_SECRET_KEY
            const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '15m' })
            const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
            console.log(link)
            // // Send Email
            // let info = await transporter.sendMail({
            //   from: process.env.EMAIL_FROM,
            //   to: user.email,
            //   subject: "GeekShop - Password Reset Link",
            //   html: `<a href=${link}>Click Here</a> to Reset Your Password`
            // })
            res.send({ "status": "success", "message": "Password Reset Email Sent... Please Check Your Email" })
          } else {
            res.send({ "status": "failed", "message": "Email doesn't exists" })
          }
        } else {
          res.send({ "status": "failed", "message": "Email Field is Required" })
        }
      }

      static userPasswordReset = async (req, res) => {
        const { password, password_confirmation } = req.body
        const { id, token } = req.params
        const user = await UserModel.findById(id)
        const new_secret = user._id + process.env.JWT_SECRET_KEY
        try {
          jwt.verify(token, new_secret)
          if (password && password_confirmation) {
            if (password !== password_confirmation) {
              res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
            } else {
              const salt = await bcrypt.genSalt(10)
              const newHashPassword = await bcrypt.hash(password, salt)
              await UserModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } })
              res.send({ "status": "success", "message": "Password Reset Successfully" })
            }
          } else {
            res.send({ "status": "failed", "message": "All Fields are Required" })
          }
        } catch (error) {
          console.log(error)
          res.send({ "status": "failed", "message": "Invalid Token" })
        }
      }

      static languages = async (req,res) =>{
        const languages = await LanguageModel.find();
        console.log("langauges");
        console.log(languages);
      }
}

export default UserController;