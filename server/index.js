const express = require("express");
const users = require("./sample.json");
const app = express();
const fs = require("fs");
const cors = require('cors');
app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    methods :["GET","POST","PATCH","DELETE"] 
}));
const port = 8000;

app.listen(port,(err)=>{
    console.log(`App is running in port ${port}`);
})
app.delete("/users/:id",(req,res)=>{
    let id = Number(req.params.id);
    let filterdata = users.filter((user)=>user.id!==id);
    fs.writeFile("./sample.json",JSON.stringify(filterdata),(err,data)=>{
        return res.json(filterdata);
    });
})
app.get("/users",(req,res)=>{
    return res.json(users);
})

app.post("/users",(req,res)=>{
    let {name,age,city} = req.body;
    if(!name || !age || !city){
        return res.status(400).send({"message":"All fields are Required"});
    }
    let id = Date.now();
    users.push({id,name,age,city});
    fs.writeFile("./sample.json",JSON.stringify(users),(err,data)=>{
        return res.json({"message":"Fields are added successfully"});
    });
})

app.patch("/users/:id",(req,res)=>{
    let id = Number(req.params.id);
    let {name,age,city} = req.body;
    if(!name || !age || !city){
        return res.status(400).send({"message":"All fields are Required"});
    }
   
    let index = users.findIndex((user)=> user.id==id);
    users.splice(index,1,{...req.body});
    fs.writeFile("./sample.json",JSON.stringify(users),(err,data)=>{
        return res.json({"message":"Fields are added successfully"});
    });
})