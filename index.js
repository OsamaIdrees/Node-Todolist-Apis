const express = require("express");
const app = express();
const cors = require("cors")
const db = require('./db_connection');
const e = require("express");
app.use(cors());
app.use(express.urlencoded({
    extended:true
}));
app.use(express.json())
app.get("/",function(req,res){
    res.send("Welcome to Node Apis")
})
app.get("/get-all-tasks",function(req,res){
   db.query("select * from todolist",function(err,result){
       if(err){
           console.log(err)
       }
       else{
           return res.json(result)
       }
   })
});
app.post("/add-todo-item",function(req,res){
    const task = req.body.task
    const status = req.body.status
    const deadline = req.body.deadline
    db.query(`insert into todolist (task,status,deadline) values ('${task}','${status}','${deadline}') `,function(err,result){
        if(err){
            console.log(err)
        }
        else{
            return res.json({'status':true,'message':'Task Added'});
        }
    })
})

app.get("/delete-todo-task/:task_id",function(req,res){
    const task_id = req.params.task_id
    db.query(`delete from todolist where id = ${task_id}`,function(err,result){
        if(err){
            return res.json({'status':false,'message':err})
        }
        else{
            if(result.affectedRows > 0){
                return res.json({'status':true,'message':'Task deleted Successfully'})
            }
            else{
                return res.json({'status':false,'message':"Something went wrog"})
            }
            
            
        }
    })
})
app.post("/update-task",function(req,res){
    const task_id = req.body.id
    const task = req.body.task
    const status = req.body.status
    const deadline = req.body.deadline
    db.query(`update todolist set task = '${task}', status = '${status}' , deadline = '${deadline}' where id = '${task_id}'`,function(err,result){
        if(err){
            return res.json({'status':false,'message':err})
        }
        else{
            return res.json({'status':true,'message':'Task Updated Successfully'})
        }
    })
})
app.post('/register',function(req,res){
    const user_information = {
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        contact_no:req.body.contact_no
    }
    db.query(`insert into user(username,email,password,contact_no) values('${user_information.username}','${user_information.email}','${user_information.password}','${user_information.contact_no}')`,function(err,result){
        if(err){
            console.log(err)
        }
        else{
            return res.json({'status':true,'message':'User Registered Successfully'});
        }
    })
})
app.post('/login',function(req,res){
    const loginInfo = {
        email:req.body.email,
        password:req.body.password
    }
    db.query(`select id,username,email,contact_no from user where email = '${loginInfo.email}' and password = '${loginInfo.password}'`,function(err,result){
        if(err){
            console.log(err)
        }
        else{
            if(result.length !== 0){
                return res.json({'status':true,'message':'Login Successful', 'information':result});
            }
            else{
                return res.json({'status':false,'message':'Invalid email or password'});
            }
          
        }
    })
})
app.get("*",function(req,res){
    res.send("Sorry! Route does not exist")
})
app.listen("5000")