const express=require('express')
const router=express.Router();
const {RegisterUser,LoginUser,AddJobs,GetJobs,EditJobs,DeleteJobs,AppliedJobs,MyJobs} = require('../Controller/Logics')
router.use(express.json());

router.post('/users/login',LoginUser)
router.post('/users/register',RegisterUser)
router.post('/JobFrom',AddJobs);

router.post('/ApplyJobs',AppliedJobs);
router.get('/MyJobs',MyJobs);




router.get('/JobList',GetJobs);
router.put('/JobList/:id',EditJobs);
router.delete('/JobList/:id',DeleteJobs);



module.exports=router;



