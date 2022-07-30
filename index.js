//user: connectzone 
//password: nLvAgmiHEoo6mhnT;

const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors'); 
const app=express();
const port =process.env.PORT||5000;

// -------------------



const uri = "mongodb+srv://connectzone:nLvAgmiHEoo6mhnT@cluster0.kombg.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
/*client.connect(err => {
  const collection = client.db("test").collection("devices");
  console.log("zilani");
  client.close();
});*/
async function run(){
    try{
     await client.connect();
     //..........newsfeed posts database.............//
     const newsCollection=client.db("connectzone").collection("posts");
     //.........users database collection............//
     const usersCollection=client.db("connectzone").collection("users");
     //..........get api for newsfeed posts.........//
     app.get('/posts',async(req,res)=>{
     const query={};
     const posts =await newsCollection.find(query).toArray();
     res.send(posts);

     })

     //..........................post api for news feed post...............//
     app.post('/post',async(req,res)=>{
      const post=req.body;
      const result=await newsCollection.insertOne(post);
      res.send(result);

     })
     //...................get api for users...........//
     app.get('/users',async(req,res)=>{
         const query={};
         const users=await usersCollection.find(query).toArray();
         res.send(users)


     })
     //................post api for user....//
     app.post('/user',async(req,res)=>{
          const user=req.body;
          const result=await usersCollection.insertOne(user);
          res.send(result);

     })
     //..................get api for users to find by email.........///
     app.get('/user/:email',async(req,res)=>{
      const email=req.params.email;
      const query={email:email};
      const find=await usersCollection.findOne(query);
      res.json(find);
     })
    }
    finally{

    }
}
run().catch(console.dir);
app.use(cors());
app.use(express.json());//middleware
app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })