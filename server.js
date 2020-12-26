const express=require("express");
const app=express();

const bodyParser=require("body-parser");
app.use(bodyParser.json())

const bCrypt=require("bcrypt")

const mockUserData=[
    {name:"Mark"},
    {name:"Jill"}]

app.get("/users", function(req, res){
    res.json({
        success:true,
        message:"successfully got users. Nice!",
        users:mockUserData
    })
});

app.get("/users/:id", (req, res)=>{
    console.log(req.params.id)
    res.json({
        success:true,
        message:"got one user",
        user:req.params.id
    })
})

//create new user
const UserData=[];

app.post("/newUser", async(req, res)=>{
    let match=UserData.find(user=>user.username===req.body.username);
    if(match==null){
        try{
            let hashedPassword=await bCrypt.hash(req.body.password, 10)
            let newuser={username:req.body.username, password:hashedPassword};
            UserData.push(newuser);
            res.status(201).send(`New user ${newuser.username} has been created`)
        }catch{
            res.status(500).send()
        }
    }else{
        res.send(`${match.username} already exists`)
    }

})


app.post("/login", async (req, res)=>{

    let user=UserData.find(element=>element.username===req.body.username);
    if(!user){
        return res.status(400).send("Username does not exist")
    }

    try{
        if(await bCrypt.compare(req.body.password, user.password)){
            res.json({
                success:true, 
                message:"password and username match",
                token: "encrypted token goes here"
            })}
        else{
            res.json({
                success:false,
                message:"password and username do not match"
            })
        }
    }catch{
        res.status(500).send()
    }
})


app.listen(8000, ()=>{console.log("server is running")})


