import userModel from "../models/userModel.js";

export const getUserData = async (req,res)=>{
    try{
        const userID = req.user.id
        const user = await userModel.findOne({ _id: userID });

        if(!user){
            return res.json({success : false , message : "User not found"})
        }

        res.json({
            success : true ,
            userData : {
                name : user.name,
                isVerified : user.isVerified
            }
        })

    }catch(error){
        return res.json({success : false ,message :  error.message})
    }
}