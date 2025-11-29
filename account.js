const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://AXkyJellyfish:A2Xky1314%28%29@cluster0.6ndamsl.mongodb.net/myApp?retryWrites=true&w=majority";
const client = new MongoClient(uri);

let usersCollection;


async function startServer() {
  try {
    await client.connect();
    console.log("MongoDB connected");

    const db = client.db("myApp");
    usersCollection = db.collection("users");

    app.listen(3000, () => console.log("Server running on http://localhost:3000"));
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
}

startServer();

app.post("/signup", async (req, res) => {
  try {
    const { username, password, phone, mood, perfer, avatar } = req.body;

    if (!username || !password) return res.json({ success: false, message: "Missing username or password" });

    const existing = await usersCollection.findOne({ username });
    if (existing) return res.json({ success: false, message: "User exists" });

    await usersCollection.insertOne({ username, password,phone,
                        mood,
                        perfer,
                        avatar, });
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
  }catch{
    console.error(err);
        res.json({ success: false, message: "Database error" });
  }
});