import UserModel from "../models/User.js";
import bcrypt from 'bcrypt';

const checkUserWebAuth = async (req, res, next) =>{
    console.log(req.session);
    console.log("can't come");
    if (req.session.userId) {
        const result = await UserModel.findOne({email:req.session.email});
        if(result != null){
            // const isMatch = await bcrypt.compare(req.session.password, result.password);
            // if(result.email == req.session.email && isMatch){
            //     console.log("=== in dashboard");
            //     next();
            // }else{
            //     res.redirect('/login');
            // }
            next();
        }else{
            res.redirect('/login');
        }
    } else {
        // User is not authenticated, redirect to the login page
        console.log("you can't go to dashboard ----");
        res.redirect('/login');
    }

}

export default checkUserWebAuth;