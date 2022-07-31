//user: connectzone
//password: nLvAgmiHEoo6mhnT;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// -------------------

const uri =
  "mongodb+srv://connectzone:nLvAgmiHEoo6mhnT@cluster0.kombg.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
/*client.connect(err => {
  const collection = client.db("test").collection("devices");
  console.log("zilani");
  client.close();
});*/
async function run() {
  try {
    await client.connect();
    //..........newsfeed posts database.............//
    const postsCollection = client.db("connectzone").collection("posts");
    //.........users database collection............//
    const usersCollection = client.db("connectzone").collection("users");
    // comments collection
    const commentsCollection = client.db("connectzone").collection("comments");
    // likes collection
    const likesCollection = client.db("connectzone").collection("likes");

    //..........get api for newsfeed posts.........//
    app.get("/posts", async (req, res) => {
      const query = {};
      const posts = await postsCollection.find(query).toArray();
      res.send(posts);
    });

    //..........................post api for news feed post...............//
    app.post("/post", async (req, res) => {
      const post = req.body;
      const result = await postsCollection.insertOne(post);
      res.send(result);
    });
    // get post by id
    app.get("/post/:id", async (req, res) => {
      const id = req.params.id;
      const post = await postsCollection.findOne({ _id: ObjectId(id) });
      res.send(post);
    });
    //...................get api for users...........//
    app.get("/users", async (req, res) => {
      const query = {};
      const users = await usersCollection.find(query).toArray();
      res.send(users);
    });
    //................post api for user....//
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
    //..................get api for users to find by email.........///
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const find = await usersCollection.findOne(query);
      res.json(find);
    });


    //get all comments
    app.get("/comments", async (req, res) => {
      const comments = await commentsCollection.find({}).toArray();
      res.send(comments);
    });
    // post a comment
    app.post("/comment", async (req, res) => {
      const comment = req.body;
      const result = await commentsCollection.insertOne(comment);
      res.send(result);
    });
    // get comments by post id
    app.get("/comments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { postId: id };
      const comments = await commentsCollection.find(query).toArray();
      res.send(comments);
    });

    //update likes count by post id
    app.put("/like/:id", async (req, res) => {
      const filter = { _id: ObjectId(req.params.id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          postLikes: req.body,
        },
      };
      const result = await postsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    
  } finally {
  }
}
run().catch(console.dir);
app.use(cors());
app.use(express.json()); //middleware
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
