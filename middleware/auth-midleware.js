import jwt from 'jsonwebtoken';
import UserModel from "../models/User.js";

const checkUserAuth = async (req, res, next) =>{
    let token
    const {authorization} = req.headers
    if(authorization && authorization.startsWith('Bearer')){
        try {
            token = authorization.split(' ')[1];
            const {userID} = jwt.verify(token, process.env.JWT_SECERT_KEY);
            req.user = await UserModel.findById(userID).select("-password");
            next();
        } catch (error) {
            console.log(error);
            res.status(401).send({"status":"failded", "message": "unauthorize user"});
        }
    }
    if(!token){
        res.status(401).send({"status":"failed","message":"Unauthorize user, No token"})
        // let message = "Unauthorize user";
        // res.render("unauthorize", {message});
        // res.redirect('/login');
    }
}

export default checkUserAuth;