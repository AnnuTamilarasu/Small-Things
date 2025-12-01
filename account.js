const express = require("express");
const cors = require("cors");
const { MongoClient,ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://AXkyJellyfish:A2Xky1314%28%29@cluster0.6ndamsl.mongodb.net/myApp?retryWrites=true&w=majority";
const client = new MongoClient(uri);

let usersCollection;
let messagesCollection;


async function startServer() {
  try {
    await client.connect();

    const db = client.db("myApp");
    usersCollection = db.collection("users");
    messagesCollection=db.collection("messages"); 

    app.listen(3000, () => console.log("Server running on http://localhost:3000"));
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
}

startServer();

app.post("/signup", async (req, res) => {
  try {
    const { username, password, phone, mood, perfer, avatar,friends } = req.body;

    if (!username || !password) return res.json({ success: false, message: "Missing username or password" });

    const existing = await usersCollection.findOne({ username });
    if (existing) return res.json({ success: false, message: "User exists" });

    await usersCollection.insertOne({ 
      username, 
      password,
      phone,
      mood,
      perfer,
      avatar, 
      friends});
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) return res.json({ success: false, message: "Missing username or password" });

    const user = await usersCollection.findOne({ username });

    if (!user || user.password !== password) {
      return res.json({ success: false, message: "Invalid username or password" });
    }

    res.json({ success: true,
        user:{
        id: user._id.toString(),
        username: user.username,
        password:user.password,
        phone: user.phone,
        mood: user.mood,
        perfer: user.perfer,
        avatar: user.avatar,
        friends:user.friends,
        } 

    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
});

app.post("/profile",async(req,res)=>{
  try{
    let {id,avatar} = req.body;
    if (!id) return res.json({ success: false, message: "No id provided" });
    id=id.trim();
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
if (!user) return res.json({ success: false, message: "User not found" });
    const result=await usersCollection.updateOne(
      {_id:new ObjectId(id)},
      {
        $set:{avatar}
      }
    );

        res.json({ success: true });
  }catch(err){
    console.error(err);
        res.json({ success: false, message: "Database error" });
  }
});

app.post("/chat",async(req,res)=>{
  try{
     let {id,mood,perfer} = req.body;
    if (!id) return res.json({ success: false, message: "No id provided" });
    id=id.trim();
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
if (!user) return res.json({ success: false, message: "User not found" });
    const result=await usersCollection.updateOne(
      {_id:new ObjectId(id)},
      {
        $set:{mood,perfer} 
      }
    );
    

        res.json({ success: true });
  }catch(err){
    console.error(err);
    res.json({success:false,message:"Database error"});
  }
});

app.post("/innerchat",async(req,res)=>{
  try {
    let { id, mood, perfer } = req.body;

    if (!id) return res.json({ success: false, message: "No id" });

    const match = await usersCollection.findOne({
      _id: { $ne: new ObjectId(id) },
      mood: perfer,
      perfer: mood
    });

    if (!match) {
      return res.json({ success: false, message: "No matching user found" });
    }

    return res.json({
      success: true,
      other: {
        id: match._id,
        username: match.username,
        mood: match.mood,
        perfer: match.perfer,
        avatar: match.avatar
      }
    });

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
});

app.post("/addfriend", async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    if (!userId || !friendId) {
      return res.json({ success: false, message: "Missing IDs" });
    }

    const userObjectId = new ObjectId(userId);
    const friendObjectId = new ObjectId(friendId);

    await usersCollection.updateOne(
      { _id: userObjectId },
      { $addToSet: { friends: friendObjectId.toString() } } 
    );

    await usersCollection.updateOne(
      { _id: friendObjectId },
      { $addToSet: { friends: userObjectId.toString() } }
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
});

app.post("/mychat",async(req,res)=>{
try{
  const {friendId}=req.body;
  if (!friendId) {
      return res.json({ success: false, message: "No friendId provided" });
    }
  const friend=await usersCollection.findOne({
    _id: new ObjectId(friendId),
  });
  if (!friend) {
      return res.json({ success: false, message: "Friend not found" });
    }
  return res.json({
    success:true,
    chat:{
      id: friend._id.toString(),
        username: friend.username,
        mood: friend.mood,
        perfer: friend.perfer,
        avatar: friend.avatar
    }
  });
}catch(err){
  console.error(err);
  res.json({success:false,message:"Error"});
}
});

app.post("/sendMessage",async(req,res)=>{
  try{
    const { from, to, text } = req.body;

    if (!from || !to || !text) {
      return res.json({ success: false, message: "Missing fields" });
    }

    await messagesCollection.insertOne({
      from,
      to,
      text,
      time: Date.now()
    });

    res.json({ success: true });
  }catch(err){
    console.error(err);
    res.json({success:false});
  }
});

app.post("/getMessages", async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    const msgs = await messagesCollection.find({
      $or: [
        { from: userId, to: friendId },
        { from: friendId, to: userId }
      ]
    }).sort({ time: 1 }).toArray();

    res.json({ success: true, messages: msgs });

  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});
app.post("/search",async(req,rec)=>{
  try {
    const {userI}=req.body;
  if (!userI) {
      return res.json({ success: false, message: "No friendId provided" });
    }
  const friend=await usersCollection.findOne({username:userI});
  if (!friend) {
      return res.json({ success: false, message: "Friend not found" });
    }
  return res.json({
    success:true,
    chat:{
      id: friend._id.toString(),
        username: friend.username,
        mood: friend.mood,
        perfer: friend.perfer,
        avatar: friend.avatar
    }
  });

  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});