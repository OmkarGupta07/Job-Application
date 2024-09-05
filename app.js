const express=require('express')
const app=express();
const cors = require('cors');
const MongoConnect=require('mongoose')

const Cookies=require('cookie-parser')
const router=require('./Routes/routes')
app.use(express.json())
app.use(Cookies());
app.use(cors({
    origin: 'http://localhost:3000' // Allow requests from this origin
  }));
app.use('/api',router);


const ConnectionUrl='mongodb://localhost:27017/JobsDataBase';
MongoConnect.connect(ConnectionUrl)
.then(_=>{
console.log('Mongo is connected');
app.listen(5000);
})
.catch((err)=> console.error(err))

app.get('/',(req,res)=>{    
    res.status(201).json({Message:'ITS WORKING PROPERLY'})
})