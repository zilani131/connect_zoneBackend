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
     const newsCollection=client.db("connectzone").collection("news");
     app.get('/news',async(req,res)=>{
     const query={};
     const news =await newsCollection.find(query).toArray();
     res.send(news);

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