const express = require("express");
const app = express();
const cors = require("cors")
const db = require('./db_connection');
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
app.get("*",function(req,res){
    res.send("Sorry! Route does not exist")
})
app.listen("5000")