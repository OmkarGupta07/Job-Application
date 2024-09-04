const mongoose=require('mongoose')
const validator=require('validator');
const bcrypt=require('bcrypt')


const UserCollection=new mongoose.Schema({
    name:{
       type:String,
       require:[true,'Enter name of the user'],
       unique:true,
   },
   email:{
       type:String,
       require:[true,'Enter name of the user'],
       validate:[validator.isEmail,'Enter Valid Email Id'],
       unique:true,
       validate: {
           validator: function (v) {
             return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
           },
           message: props => `${props.value} is not a valid email!`
         }
   },
   password:{
       type:String,
       required: [true, 'Please enter a password'],
       minlength: [6, 'Minimum password length is 6 characters']

   },
   role:{
       type:String,
       required:true,
       enum: ["admin", "user"],

   },
  

})

UserCollection.pre('save',async function(next) {
    try {
        const hashSalt=await bcrypt.genSalt();
        this.password=await bcrypt.hash(this.password,hashSalt)
        next();
    } catch (error) {
        console.log(error);  
    }
})

UserCollection.statics.LoginUser=async function (email,password){
    const SearchUser=await this.findOne({email});
    if(SearchUser){
        const ComparePassword=await bcrypt.compare(password,SearchUser.password)
        if(ComparePassword)
            return SearchUser;
        throw new Error("Please Enter Correct Password");
    }
    throw new Error("Please Enter Correct Email Id");
}

const UserModel=mongoose.model('Users',UserCollection)

const JobDetails=new mongoose.Schema({
    name:{
       type:String,
       require:[true,'Please Enter Name of the Company'],
       unique:false,
   },
   position:{
    type:String,
    required: [true, 'Please Enter the Designation'],
}
   ,
   location:{
       type:String,
       required: [true, 'Please Enter the location of the company'],
   },
   contract:{
       type:String,
       required:true,
       enum: ["Full-Time", "Part-Time" ,"Contract","Temporary","Internship"],
   },
  

})

const appliedJobSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"users",required:true},
    jobId: {type:mongoose.Schema.Types.ObjectId, ref:"jobdetails",required:true},
    appliedAt: { type: Date, default: Date.now }
});

const AppliedJob = mongoose.model('AppliedJob', appliedJobSchema);




const JobModel=mongoose.model('JobDetails',JobDetails)







module.exports={
    
    UserModel,
    JobModel,
    AppliedJob
    
}