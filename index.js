const express=require('express');
const bodyparser=require('body-parser');
const app=express()
require('dotenv').config();

const cors= require('cors');
app.use(cors());

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json());
///
app.get('/',(req,res)=>{
    res.send("hi mr");
})

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.Db_USER}:${process.env.PASS}@cluster0.9dnsi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("services").collection("service");
  console.log("data base connect")
  // perform actions on the collection object
//   client.close();
       
});






const PORT=process.env.PORT ||5000;
app.listen(PORT,()=>{
    console.log('App is listiong 5000');
})
