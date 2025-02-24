import LoginService from "../service/login-service";

export const create = async(req , res)=>{

    try {
        const user = await LoginService.create(req.body)
        return res.status(201).json({
            data : user,
            success:true,
            message:"successfully created a user",
            err:{}
        })
    } catch (error) {
        console.log(error);
    return res.status(500).json({
        data : {},
        success: false,
        message : 'not able to create a user',
        err: error
    }
}

exports const create;