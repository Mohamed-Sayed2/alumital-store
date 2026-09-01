const validate=(schema)=>(req,res,next)=>{
    try {
        schema.parse(req.body);//if invalid errors
        next();

    } catch (error) {
        res.status(400).json(
            {
                message:"validation error",
                error:error.issues.map((err)=>err.message) //array of objects
            }
        )
    }
}
export default validate;