const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(
  cors({
      origin: [
        // 'http://localhost:5173'
        'https://grill-bar-b3e50.web.app',
        'https://grill-bar-b3e50.firebaseapp.com/'
      ],
      credentials: true,
  }),
)
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
    const categoriesCollection = client.db('restaurantDB').collection('categories');
    const orderDb = client.db('orderDB')
   
    app.post('/orders', async (req, res) => {
      const {email, products} = req.body;
     console.log(email, products);
     const{_id, ...data} = products
     const orderCollection = orderDb.collection(email)
      const result = await orderCollection.insertOne(data);
      res.send(result);
  })

  app.get('/orders/:email', async (req, res) => {
    const email = req.params.email;
    const query = {email: email}
    const orderCollection = orderDb.collection(email)
    const cursor = orderCollection.find()
    const result = await cursor.toArray(query);
    res.send(result);
   })

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

      app.get('/categories', async (req, res) => {
        const cursor = categoriesCollection.find();
        const result = await cursor.toArray();
        res.send(result);
        })

      app.get('/menu/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await menuCollection.findOne(query);
        res.send(result);
        })

      app.get('/category/:category', async (req, res) => {
        const category = req.params.category;
        const query = {category:category}
        const cursor = menuCollection.find(query)
        const result = await cursor.toArray(query);
        res.send(result);
        })
      
        app.post('/menu', async (req, res) => {
          const newFood = req.body;
          console.log(newFood);
          const result = await menuCollection.insertOne(newFood);
          res.send(result);
        })

        app.delete('/menu/:id', async(req, res)=> {
          const id = req.params.id;
          const query = { _id: new ObjectId(id)}
          const result= await menuCollection.deleteOne(query);
          res.send(result)
        })


        app.put('/menu/:id', async(req, res)=>{
          const id = req.params.id;
          const filter = { _id: new ObjectId(id)};
          const options = {upsert: true};
          const updatedFood = req.body
          const updated = {
            $set: {
              name: updatedFood.name, 
              category: updatedFood.category, 
              quantity: updatedFood.quantity, 
              chef: updatedFood.chef, 
              origin: updatedFood.origin, 
              price:updatedFood.price, 
              image: updatedFood.image,
            }
          }
          const result = await menuCollection.updateOne(filter, updated, options);
          res.send(result);
          
        })
      app.get('/category/:category', async (req, res) => {
          const category = req.params.category;
          const query = {category:category}
          const cursor = menuCollection.find(query)
          const result = await cursor.toArray(query);
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