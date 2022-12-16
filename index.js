const express=require('express');
const bodyparser=require('body-parser');
const app=express()
// const stripe = require("stripe")(process.env.SRIPE_KEY)
const stripe = require("stripe")('	sk_test_51L3R9oImIQQxLhtmjIp1Y9Eow9VUUthNjg7gs9mmjxdBkjWYZLOPkfcIP2y1EksXrnhQqTZY0qtrJVijIftmx39D00oe9kutMa');
var jwt = require('jsonwebtoken');
require('dotenv').config();

const cors= require('cors');
app.use(cors());

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json());
///
app.get('/',(req,res)=>{
    res.send("hi mr");
})
//${process.env.Db_USER} ${process.env.Db_PASS}
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const uri = "mongodb+srv://Car2:BMa4fWG7W4gOWS6C@cluster0.9dnsi.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
  try{
     await client.connect();
     const collection = client.db("services").collection("service");
     const Usercollection = client.db("users").collection("user");
     const UserOrders = client.db("Orders").collection("order");
     const UserRevew= client.db("UserRevew").collection("revew");
     const Myprofile= client.db("Profiles").collection("profile");
     const paymentCollection= client.db("payments").collection("payment");
     
     // get api
     app.get('/products',async(req,res)=>{
         const query={};
         const cursor= collection.find(query)
         const product=await cursor.toArray();
         res.send(product);

     });
     // get all user
     app.get('/users',async(req,res)=>{
         const query={};
         const cursor= Usercollection.find(query)
         const product=await cursor.toArray();
         res.send(product);

     });
     // delete one user
     app.delete('/user/:id',async(req,res)=>{
      const id=req.params.id;
      const filter={_id:ObjectId(id)};
      const result = await Usercollection.deleteOne(filter);
      res.send(result);

  })
  // get all items
     app.get('/ordersItem',async(req,res)=>{
         const query={};
         const cursor= UserOrders.find(query)
         const product=await cursor.toArray();
         res.send(product);

     });
     //delete one item
     app.delete('/OrdersItem/:id',async(req,res)=>{
      const id=req.params.id;
      const filter={_id:ObjectId(id)};
      const result = await UserOrders.deleteOne(filter);
      res.send(result);

  })
     app.get('/payment/:id',async(req,res)=>{
      const id=req.params.id;
      const filter={_id:ObjectId(id)};
      const result = await UserOrders.findOne(filter);
      res.send(result);

  })

        /// post api
        app.post('/products',async(req,res)=>{
          const data=req.body;
          console.log(data);
          const result=await UserOrders.insertOne(data)
          res.send(result);})

         // admin Product
        app.post('/product',async(req,res)=>{
          const data=req.body;
          const result=await collection.insertOne(data)
          res.send(result);});
          // revew
          app.post('/revew',async(req,res)=>{
               const data=req.body;
               const result= await UserRevew.insertOne(data);
               res.send(result);
          })
          // revew get 
          app.get('/revew',async(req,res)=>{
            const query={};
            const cursor= UserRevew.find(query);
            const result=await cursor.toArray();
            res.send(result);
          })

            //order
          app.put('/products/increase/:id',async(req,res)=>{
            const id=req.params.id;
            const data=req.body;
            console.log("data",data);
            const filter =  {_id:ObjectId(id) } ;
            console.log("filter",filter);
            const options = { upsert: false };
            const updateDoc = {
              $inc: { quantity: Number(data.amount || 0)}
                       }
            try{
                const result = await collection.updateOne(filter, updateDoc, options);
                res.send(result);
            }catch(e){
                res.send("failed to update");
            }
              
        })
        // for user
        app.put('/user/:email',async(req,res)=>{
          const email=req.params.email;
          const user=req.body;
          const filter={email:email}
          const options = { upsert: true };
           const updateDoc = {
            $set:user };
            const result = await Usercollection.updateOne(filter, updateDoc, options);
            const token=jwt.sign({email:email},process.env.JWT_TOKEN)
            res.send({result,token});
            // console.log({result,token})

        })
        app.put('/profile/:email',async(req,res)=>{
          const email=req.params.email;
          const user=req.body;
          const filter={email:email}
          const options = { upsert: true };
           const updateDoc = {
            $set:user };
            const result = await  Myprofile.updateOne(filter, updateDoc, options);
            res.send(result);
            // console.log({result,token})

        });
        app.get('/profile',async(req,res)=>{
          const query={};
          const cursor= Myprofile.find(query);
          const result=await cursor.toArray();
          res.send(result);

      })
        app.put('/admin/:email',async(req,res)=>{
          const email=req.params.email;
          const filter={email:email}
           const updateDoc = {
            $set:{role :'admin'}};
            const result = await Usercollection.updateOne(filter, updateDoc);
            res.send(result);
            // console.log({result,token})

        })
        app.delete('/admin/:id',async(req,res)=>{
          const id=req.params.id;
          const filter={_id:ObjectId(id)};
          const result = await Usercollection.deleteOne(filter);
          res.send(result);

      })
      //   app.get('/admin/:email',async(req,res)=>{
      //     const email=req.params.email;
      //     const user=await Usercollection.findOne({email:email})
      //     console.log(user);
      //     const isAdmin= user.role ==='admin';
      //     res.send(isAdmin);

      // })
        //  app.get('/getuser/:id',async(req,res)=>{
        //   const id=req.params.id;
        //   const filter={_id:ObjectId(id)};
        //    const result = await UserOrders.findOne(filter);
        //   res.send(product);

        //  })
          /// put api
          app.put('/products/reduce/:id',async(req,res)=>{
            const id=req.params.id;
            const data=req.body;
            console.log(data);
            const filter =  {_id:ObjectId(id)} ;
            console.log("filter",filter);
            const options = { upsert: false };
            const updateDoc = {
               $inc: { quantity:-Number(data.amout ||0) } }
              const result = await collection.updateOne(filter, updateDoc, options);
              res.send(result);
        });

        // user ubdate
        // app.put('user/:id',async(req,res)=>{
        //   const collection = client.db("adim").collection("makeAdmin");
        //   const id=req.params.id;
        //   const data=req.body;
        //   const filter =  {_id:ObjectId(id)} ;
        //   const options = { upsert: true };
        //   // const updateDoc = {
        //   //   $inc: { quantity:-Number(data.amout ||0) } }
        //   const result = await Usercollection.updateOne(filter, updateDoc, options);
          // res.send(result);

        // })
        // delete user
        app.delete('/products/:id',async(req,res)=>{
          const collection = client.db("adim").collection("makeAdmin");
          const id=req.params.id;
          const filter={_id:ObjectId(id)};
          const result = await collection.deleteOne(filter);
          res.send(result);

      })

     
        // delete
        app.delete('/serviceDelete/:id',async(req,res)=>{
          const id=req.params.id;
          const filter={_id:ObjectId(id)};
          const result = await collection.deleteOne(filter);
          res.send(result);

      })
      app.get('/admin/:email',async(req,res)=>{
        const email=req.params.email;
        const user=await Usercollection.findOne({email:email})
        console.log(user);
        const isAdmin= user.role ==='admin';
        res.send(isAdmin);

    })
     /// payment 
    //  app.post('/create-payment-intent',  async(req, res) =>{
    //   const service = req.body;
    //   const price = service.price;
    //   const amount = price*100;
    //   const paymentIntent = await stripe.paymentIntents.create({
    //     amount : amount,
    //     currency: 'usd',
    //     payment_method_types:['card']
    //   });
    //   res.send({clientSecret: paymentIntent.client_secret})
    // });
    // app.post('/create-payment-intent', async (req, res) => {
    //   const service = req.body;
    //   const price = service.productPrice;
    //   const amount = price * 100;
    //   const paymentIntent = await stripe.paymentIntents.create({
    //     amount: amount,
    //     currency: 'usd',
    //     payment_method_types: ['card']
    //   });
    //   res.send({ clientSecret: paymentIntent.client_secret })
    // });
    app.post('/create-payment-intent', async (req, res) => {
      const service = req.body;
      const price = service.newprice;
      const amount = price * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        payment_method_types: ['card']
      });
      res.send({ clientSecret: paymentIntent.client_secret })
    });
    app.patch('/order/:id',  async (req, res) => {
      const id = req.params.id;
      const payment = req.body;
      const filter = { _id: ObjectId(id) }
      const updateDoc = {
        $set: {
          paid: true,
          transactionId: payment.transactionId
        }
      }
      const updatedOrder = await UserOrders.updateOne(filter, updateDoc);
      const result = await paymentCollection.insertOne(payment)
      res.send(updatedOrder)

    })
//  patch...
    // app.patch('/order/:id',  async (req, res) => {
    //   const id = req.params.id;
    //   const payment = req.body;
    //   const filter = { _id: ObjectId(id) }
    //   const updateDoc = {
    //     $set: {
    //       paid: true,
    //       transactionId: payment.transactionId
    //     }
    //   }
    //   const updatedOrder = await UserOrders.updateOne(filter, updateDoc);
    //   const result = await paymentCollection.insertOne(payment)
    //   res.send(updatedOrder)

    // })
    }
    finally{}
  }
  run().catch(console.dir);


const PORT=process.env.PORT ||5000;
app.listen(PORT,()=>{
    console.log('App is listiong 5000');
})
