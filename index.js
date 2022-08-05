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
    //groups collection
    const groupsCollection = client.db("connectzone").collection("groups");
    // likes collection
    const likesCollection = client.db("connectzone").collection("likes");
    // Friends Request collection
    const friendRequestCollection = client
      .db("connectzone")
      .collection("friendRequests");

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
    // get posts by email
    app.get("/posts/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const posts = await postsCollection.find(query).toArray();
      res.send(posts);
    });
    // get posts by friends array 
    app.get("/postsByFriends/:friends", async (req, res) => {
      const friends = req.params.friends;
      const friendsArray = friends.split(",");
      const query = { userEmail: { $in: friendsArray } };
      const posts = await postsCollection.find(query).toArray();
      res.send(posts);
    })
    //update all posts userImage
    app.put("/updatePostUserImage/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { userEmail: email };
      const updateDoc = { $set: { userImage: req.body.userImage } };
      const result = await postsCollection.updateMany(filter, updateDoc);
      res.send(result);
    })
    //update all posts userName
    app.put("/updatePostUserName/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { userEmail: email };
      const updateDoc = { $set: { userName: req.body.userName } };
      const result = await postsCollection.updateMany(filter, updateDoc);
      res.send(result);
    })



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
    //update user by email
    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = req.body;
      const result = await usersCollection.updateOne(query, { $set: user });
      res.send(result);
    })
    // show user all friends by friends array
    app.get("/user/:email/friends", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const find = await usersCollection.findOne(query);
      const friends = find.friends;
      const query2 = { email: { $in: friends } };
      const users = await usersCollection.find(query2).toArray();
      res.send(users);
    }),



    //post a group
    app.post("/group", async (req, res) => {
      const group = req.body;
      const result = await groupsCollection.insertOne(group);
      res.send(result);
    })
    // get group by creatorEmail
    app.get("/groups/:creatorEmail", async (req, res) => {
      const creatorEmail = req.params.creatorEmail;
      const query = { groupCreatorEmail: creatorEmail };
      const groups = await groupsCollection.find(query).toArray();
      res.send(groups);
    })
    // get all groups
    app.get("/groups", async (req, res) => {
      const query = {};
      const groups = await groupsCollection.find(query).toArray();
      res.send(groups);
    })
    //get single group by groupSlug
    app.get("/groupBySlug/:groupSlug", async (req, res) => {
      const groupSlug = req.params.groupSlug;
      const query = { groupSlug: groupSlug };
      const group = await groupsCollection.findOne(query);
      res.send(group);
    })
    //post to group
    app.post("/group/:groupSlug", async (req, res) => {
      const groupSlug = req.params.groupSlug;
      const query = { groupSlug: groupSlug };
      const group = await groupsCollection.findOne(query);
      const post = req.body;
      group.groupPosts.push(post);
      const result = await groupsCollection.updateOne(query, { $set: group });
      res.send(result);
    })
    //get group posts by groupSlug
    app.get("/group/:groupSlug/posts", async (req, res) => {
      const groupSlug = req.params.groupSlug;
      const query = { groupSlug: groupSlug };
      const group = await groupsCollection.findOne(query);
      res.send(group.groupPosts);
    }),



    

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


    // post a request to add friend
    app.post("/friendRequest", async (req, res) => {
      const request = req.body;
      const result = await friendRequestCollection.insertOne(request);
      res.send(result);
    });
    // check is this user already sent request to this user
    app.get("/friendRequest/:senderEmail/:receiverEmail", async (req, res) => {
      const senderEmail = req.params.senderEmail;
      const receiverEmail = req.params.receiverEmail;
      const query = {
        senderEmail: senderEmail,
        receiverEmail: receiverEmail,
      };
      const find = await friendRequestCollection.findOne(query);
      res.send(find);
    });
    //get all requests
    app.get("/friendRequests", async (req, res) => {
      const requests = await friendRequestCollection.find({}).toArray();
      res.send(requests);
    })
    //get requests by receiver email
    app.get("/friendRequests/:receiverEmail", async (req, res) => {
      const receiverEmail = req.params.receiverEmail;
      const query = { receiverEmail: receiverEmail };
      const requests = await friendRequestCollection.find(query).toArray();
      res.send(requests);
    })
    // delete friend request
    app.delete("/acceptFriendRequest/:senderEmail/:receiverEmail", async (req, res) => {
      const senderEmail = req.params.senderEmail;
      const receiverEmail = req.params.receiverEmail;
      const query = {
        senderEmail: senderEmail,
        receiverEmail: receiverEmail,
      };
      const result = await friendRequestCollection.deleteOne(query);
      res.send(result);
    })
    // push an email to friends array
    app.put("/pushFriend/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const updateDoc = {
        $set:  req.body,
      };
      const result = await usersCollection.updateOne(
        query,
        updateDoc
      );
      res.send(result);
    })


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
