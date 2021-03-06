const express = require('express'); 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const res = require('express/lib/response');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();

// middleware

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2wzc8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
  try{
    await client.connect();
    const inventoryCollection = client.db("SimpleWarehouse").collection("inventory");
    
    

    app.get('/inventory',  async(req, res) =>{
      const query = {};
      const cursor = inventoryCollection.find(query);
      const inventorys = await cursor.toArray();
      res.send(inventorys);
    });

    // get single items

    app.get('/inventory/:id', async(req, res) =>{
      const id = req.params.id;
      
      const query={_id: ObjectId(id)};
      const result = await inventoryCollection.findOne(query);
      res.send(result);
      console.log(req.params.body);
  });
   
  app.post('/inventory', async(req, res)=>{
    const newItem = req.body;
    const result = await  inventoryCollection.insertOne(newItem)
    res.send(result);
  })

  app.delete('/inventory/:id',  async(req, res)=>{
    const id = req.params.id;
    const query={_id: ObjectId(id)};
    const result = await inventoryCollection.deleteOne(query);
    res.send(result);
  });

  // post update

  app.put('/inventory/:id',  async(req, res)=>{
    const id = req.params.id;
    console.log({id});
    const updatedUser = req.body;
    const filter ={_id: ObjectId(id)};
    const options = { upsert: true};
    const upDatedDoc = {
      $set: {
        quantity: updatedUser.quantity
      }
    };
    const result = await inventoryCollection.updateOne(filter, upDatedDoc, options);
    res.send(result);

  })

  }

  finally{
    // await client.close();
  }
};

run().catch(console.dir);



app.get('/', (req, res) =>{
    res.send('I can code now');
}) 

app.listen(port , () => {
    console.log('Listening to port');
})

