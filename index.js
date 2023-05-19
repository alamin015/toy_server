const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

// routes 
app.get('/',(req,res) => {
    res.send(`hello world ${process.env.DB_PASS}`)
})

// database connection and database route 



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fclnk.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("Toy_Master");
    const myCollection = database.collection("allToy");


app.get("/toy_three",async (req,res) => {
  const cursor = await myCollection.find().limit(6).toArray();
  res.send(cursor)
})


app.get("/category/:category",async (req,res) => {
  const query = { category: `${req.params.category}` };
  const cursor = await myCollection.find(query).toArray();
  res.send(cursor)
})


app.get("/details/:id", async (req,res) => {
  const query = { _id: new ObjectId(`${req.params.id}`)};
  const cursor = await myCollection.findOne(query);
  res.send(cursor)
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {


    
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







// listener 
app.listen(port,() => {
    console.log(`server is running on port : ${port}`)
})