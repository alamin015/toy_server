const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware 

const corsOptions ={
  origin:'', 
  credentials:true,    
  optionSuccessStatus:200,
  methods: ["GET","POST","DELETE","PUT","PATCH"]
}

app.use(cors(corsOptions))
app.options("",cors(corsOptions))

app.use(cors());
app.use(express.json());

// routes 
app.get('/',(req,res) => {
    res.send(`hello world`)
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
    //  client.connect();
    const database = client.db("Toy_Master");
    const myCollection = database.collection("allToy");


    app.get("/all",async (req,res) => {

      const cursor = await myCollection.find().limit(20).toArray();
      res.send(cursor)
    })

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

app.get("/specific_toy", async (req,res) => {

  const myQuery = req.query;
  const sort = {price: parseInt(myQuery.order)};
  const query = { email: `${myQuery.email}`};
  const cursor = await myCollection.find(query).sort(sort).toArray();
  let final;
  if(myQuery.order == "-1"){
    final = cursor.sort((item1,item2) => item1.price - item2.price)
  }else {
    final = cursor.sort((item1,item2) => item2.price - item1.price)
  }
  res.send(final)
})

app.get("/update/:id", async (req,res) => {
  const query = { _id: new ObjectId(req.params.id)};
  const cursor = await myCollection.findOne(query);
  res.send(cursor)
  
})

app.post("/add_toy",async (req,res) => {
  const data = req.body;
  const result = await myCollection.insertOne(data);
  res.send(result)
})



// update 
app.put("/update/:id",async (req,res) => {
  const myId = req.params.id;
  const data = req.body;
  const filter = { _id: new ObjectId(myId) };
 
  const updateDoc = {
      $set: {
        name : data.name,
        price: data.price,
        shortDescription: data.shortDescription,
        ratings: data.ratings
      },
    };


    // delete 
app.delete("/delete/:id",async (req,res) => {
  const myId = req.params.id;
  const query = { _id: new ObjectId(myId) };
  const result = await myCollection.deleteOne(query);
  res.send(result);
})
    const result = await myCollection.updateOne(filter, updateDoc);
    res.send(result)
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