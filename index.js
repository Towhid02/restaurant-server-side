const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json()); 

// console.log(DB_USER)
// console.log(DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0klimfk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const menuCollection = client.db('restaurantDB').collection('menu');
    const breakfastCollection = client.db('restaurantDB').collection('breakfast');
    const lunchCollection = client.db('restaurantDB').collection('lunch');
    const dinnerCollection = client.db('restaurantDB').collection('dinner');

    app.post('/user', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await menuCollection.insertOne(user);
      res.send(result);
    })

    app.get('/menu', async (req, res) => {
      const cursor = menuCollection.find();
      const result = await cursor.toArray();
      res.send(result);
      })

      app.get('/category/:category', async (req, res) => {
        const category = req.params.category;
        const query = {category:category}
        const cursor = menuCollection.find(query)
        const result = await cursor.toArray(query);
        res.send(result);
        })

    app.get('/breakfast', async (req, res) => {
      const cursor = breakfastCollection.find();
      const result = await cursor.toArray();
      res.send(result);
      })
      app.get('/breakfast/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await breakfastCollection.findOne(query);
        res.send(result);
        })

    app.get('/lunch', async (req, res) => {
      const cursor = lunchCollection.find();
      const result = await cursor.toArray();
      res.send(result);
      })
    app.get('/lunch/:id', async (req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await lunchCollection.findOne(query);
    res.send(result);
    })

    app.get('/dinner', async (req, res) => {
      const cursor = dinnerCollection.find();
      const result = await cursor.toArray();
      res.send(result);
      })

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Restaurant is running')
})

app.listen(port, () => {
    console.log(`Restaurant SERVER IS RUNNING ON PORT ${port}`);
})