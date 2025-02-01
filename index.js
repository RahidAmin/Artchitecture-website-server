const express = require('express');
const cors = require('cors');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


//middlewares
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://architecture-website-ff3ae.web.app',
        'https://architecture-website-ff3ae.firebaseapp.com',
        'https://comforting-strudel-8964e3.netlify.app'

    ],

}));
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nclgq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Connect the client to the server	(optional starting in v4.7)

        await client.connect();

        const architectureWorksCollection = client.db('architectureWebsiteDB').collection('works');
        const architectureMembersCollection = client.db('architectureWebsiteDB').collection('members');


        //-----Auth related api----//



        ///--------Works api------------///
        app.get('/works', async (req, res) => {
            const type = req.query.type;
            let query = {};
            if (type) {
                query = { type };
            }
            const result = await architectureWorksCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/works/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await architectureWorksCollection.findOne(query);
            res.send(result);
            // console.log(result);
        })



        app.put('/works/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const updatedWork = req.body;
            const work = {
                $set: {
                    pName: updatedWork.name, type: updatedWork.projectType, topImage: updatedWork.topimage, year: updatedWork.yeaR, location: updatedWork.locatioN, creativeDirector: updatedWork.creativedirector, visualization: updatedWork.visualizatioN, aboutImage: updatedWork.aboutimage, aboutDescription: updatedWork.aboutdescription, designImage: updatedWork.designimage, designDescription: updatedWork.designdescription, img1: updatedWork.img11,
                    img2: updatedWork.img22, img3: updatedWork.img33, img4: updatedWork.img44, img5: updatedWork.img55, img6: updatedWork.img66, img7: updatedWork.img77, img8: updatedWork.img88
                }
            }
            const result = await architectureWorksCollection.updateOne(filter, work, option);
            res.send(result);

        })

        app.post('/works', async (req, res) => {
            const newWork = req.body;
            const result = await architectureWorksCollection.insertOne(newWork);
            res.send(result);
        })

        app.delete('/works/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await architectureWorksCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        })
        //---------------About apis---------------//

        app.get('/members', async (req, res) => {
            const cursor = architectureMembersCollection.find();
            const result = await cursor.toArray();
            res.send(result);

        })

        app.get('/members/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await architectureMembersCollection.findOne(query);
            res.send(result)
            console.log(result)
        })

        app.post('/members', async (req, res) => {
            const newMember = req.body;
            const result = await architectureMembersCollection.insertOne(newMember);
            res.send(result);
        })

        app.put('/members/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const updatedMember = req.body;
            const member = {
                $set: {
                    name: updatedMember.name, designation: updatedMember.designation, image: updatedMember.image
                }
            }
            const result = await architectureMembersCollection.updateOne(filter, member, option);
            res.send(result);

        })

        app.delete('/members/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await architectureMembersCollection.deleteOne(query);
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




app.get('/', (req, res) => {
    res.send('architecture server is running');
})
app.listen(port, () => {
    console.log(`Architecture is running at port:${port}`);
})

// https://artchitecture-website-server.onrender.com/