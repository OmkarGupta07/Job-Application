const {UserModel,JobModel,AppliedJob}=require('../Model/JobAppModel')
const jwt=require('jsonwebtoken');
const mongoose=require('mongoose')
//BOOKS
const milliseconds_per_minute = 60 * 1000;
const minutes_per_hour = 60;

const createToken=async(id)=>{
    try {
    return jwt.sign({id},'ConfigureTheUser',{expiresIn:2*minutes_per_hour*milliseconds_per_minute});
    } catch (error) {
        console.log(error);
        
    }
    
    }

const RegisterUser=async(req,res) => {
    try {
        const {name,email,password}=req.body;
        const domain=email.split('@')[1];
        let role="user";
        if(domain==="alphaware.com")
          role="admin";     
               
          console.log(req.body);
        
        const CreateNewUser=await UserModel.create({name,email,password,role});
        const Token=createToken(CreateNewUser._id);
        res.cookie('jwt',Token,{httpOnly:true,maxAge:2*minutes_per_hour*milliseconds_per_minute});
        res.json({Message:'User Is Created',id:CreateNewUser._id});
    } catch (error) {
        console.log(error);    
        res.status(400).json({message:error.message})
    }
}

const LoginUser=async(req,res)=>{
    try {
        const {email,password}=req.body
        const AutheNewUser=await UserModel.LoginUser(email,password);
        console.log(AutheNewUser);
        const Token=createToken(AutheNewUser.id);
        const dts=await Token;
        console.log(dts);
        res.cookie('jwt',Token,{httpOnly:true,maxAge:2*minutes_per_hour*milliseconds_per_minute});
        res.json({Message:'User Is Configured Successfully',id:AutheNewUser.id,jwttoken:dts});
    } catch (error) {
        console.log(error);    
        res.status(400).json({message:error.message})
    }
}

const AddJobs=async(req,res)=>{
  try {
      const JobDetails=await JobModel.create(req.body);
      console.log(JobDetails);
      res.json({Message:'Job Is Successfully Added to the portal',id:JobDetails.id});
  } catch (error) {
      console.log(error);    
      res.status(400).json({message:error.message})
  }
}



const GetJobs=async (req,res)=>{
  try {

    const { name, location, contract } = req.query;

    console.log(req.query);
    
    const filter = {};
    if (name) filter["name"] = { $regex: name, $options: 'i' };
    if (location) filter["location"] = location;
    if (contract) filter["contract"] = contract;
    console.log(filter);
    
    const ListofJobs = await JobModel.find(filter);

    res.status(201).json({data:ListofJobs})
} catch (error) {
console.log(error);    
}  
}
const GetJobById=async (req,res)=>{
  try {

    const { id } = req.params;
    
    // Find the job by ID
    const job = await JobModel.findById(id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
}



const EditJobs=async (req,res)=>{
  try {
  const Id=req.params.id; 
  console.log(Id);
  console.log(req.body);
  const job = await JobModel.findById(Id);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  
  const UpdatedAck=await JobModel.updateOne({_id:Id},req.body);
  res.status(201).json({Message:'Job Is Updated',data:UpdatedAck._id})
  } catch (error) {
      console.log(error);    
res.status(400).json({message:error.message})
  }
}

const DeleteJobs=async (req,res)=>{
  try {
  const Id=req.params.id; 

  const job = await JobModel.findById(Id);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  const DeleteAck=await JobModel.deleteOne({_id:Id});
  res.status(201).json({Message:'Job Is Deleted',data:DeleteAck.acknowledged})
  } catch (error) {
      console.log(error);    
res.status(400).json({message:error.message})
  }
}



const AppliedJobs=async(req,res)=>{
  try {
    const {userid,jobid}={...req.body};
    const job = await JobModel.findById(jobid);
    const user = await UserModel.findById(userid);

if (job && user) {
  const JobDetails=await AppliedJob.create(req.body);
  console.log(JobDetails);
  return res.json({Message:'Successfully Applied to the job',id:JobDetails.id});
}
    res.json({Message:'User or Job is incorrect'});

  } catch (error) {
      console.log(error);    
      res.status(400).json({message:error.message})
  }
}

const MyJobs=async(req,res)=>{
  try {
      const JobDetails=await AppliedJob.find();
      console.log(JobDetails);
      res.json({Message:'Your Jobs',id:JobDetails.id});
  } catch (error) {
      console.log(error);    
      res.status(400).json({message:error.message})
  }
}




module.exports={GetJobById,RegisterUser,LoginUser,AddJobs,GetJobs,EditJobs,DeleteJobs,AppliedJobs,MyJobs}