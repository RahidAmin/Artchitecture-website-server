const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const fs = require('fs');





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
        'https://comforting-strudel-8964e3.netlify.app',
        'https://api.simplesymmetry-bd.com',
        'https://simplesymmetry-bd.com',
        'https://www.simplesymmetry-bd.com',

    ], credentials: true,

    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']


}));



app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nclgq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



const UPLOADS_FOLDER = './uploads/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_FOLDER);
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName = file.originalname.replace(fileExt, "").toLowerCase().split(" ").join("-") + "-" + Date.now();
        cb(null, fileName + fileExt)
    }

})



var upload = multer(
    {
        storage: storage,
        limits: {
            fileSize: 50 * 1024 * 1024
        },

        fileFilter: (req, file, cb) => {
            console.log(file)

            if (
                file.mimetype === "image/png" ||
                file.mimetype === "image/jpg" ||
                file.mimetype === "image/jpeg" ||
                file.mimetype === "image/webp"
            ) {
                cb(null, true);
            }
            else {
                cb(null, false)
            }


        }
    }
)



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


        app.post('/works', upload.fields([
            { name: 'img1', maxCount: 1 },
            { name: 'img2', maxCount: 1 },
            { name: 'img3', maxCount: 1 },
            { name: 'img4', maxCount: 1 },
            { name: 'img5', maxCount: 1 },
            { name: 'img6', maxCount: 1 },
            { name: 'img7', maxCount: 1 },
            { name: 'img8', maxCount: 1 },
            { name: 'aboutImage', maxCount: 1 },
            { name: 'designImage', maxCount: 1 },
            { name: 'topImage', maxCount: 1 },
        ]), async (req, res) => {
            try {
                const { pName, type, year, location, creativeDirector, visualization, aboutDescription, designDescription } = req.body;
                // Convert relative paths to full URLs
                const baseUrl = `${req.protocol}://${req.get('host')}`;
                const topImage = req.files?.topImage ? `${baseUrl}/uploads/${req.files.topImage[0].filename}` : null;
                const img1 = req.files?.img1 ? `${baseUrl}/uploads/${req.files.img1[0].filename}` : null;
                const img2 = req.files?.img2 ? `${baseUrl}/uploads/${req.files.img2[0].filename}` : null;
                const img3 = req.files?.img3 ? `${baseUrl}/uploads/${req.files.img3[0].filename}` : null;
                const img4 = req.files?.img4 ? `${baseUrl}/uploads/${req.files.img4[0].filename}` : null;
                const img5 = req.files?.img5 ? `${baseUrl}/uploads/${req.files.img5[0].filename}` : null;
                const img6 = req.files?.img6 ? `${baseUrl}/uploads/${req.files.img6[0].filename}` : null;
                const img7 = req.files?.img7 ? `${baseUrl}/uploads/${req.files.img7[0].filename}` : null;
                const img8 = req.files?.img8 ? `${baseUrl}/uploads/${req.files.img8[0].filename}` : null;
                const aboutImage = req.files?.aboutImage ? `${baseUrl}/uploads/${req.files.aboutImage[0].filename}` : null;
                const designImage = req.files?.designImage ? `${baseUrl}/uploads/${req.files.designImage[0].filename}` : null;
                const newWork = {
                    pName, type, year, location, creativeDirector, visualization, aboutDescription, designDescription,
                    img1, img2, img3, img4, img5, img6, img7, img8, aboutImage, designImage, topImage
                };
                const result = await architectureWorksCollection.insertOne(newWork);
                res.status(201).json(result);
            } catch (error) {
                console.error("Error uploading images:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });

        // app.post('/works', async (req, res) => {
        //     const newWork = req.body;
        //     const result = await architectureWorksCollection.insertOne(newWork);
        //     res.send(result);
        // })



        app.delete('/works/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            try {
                // Find the work entry
                const work = await architectureWorksCollection.findOne(query);
                if (!work) return res.status(404).json({ message: "Work not found" });

                // Delete images
                Object.values(work).forEach(value => {
                    if (typeof value === 'string' && value.includes('/uploads/')) {
                        const filePath = path.join(__dirname, value.replace(`${req.protocol}://${req.get('host')}/`, ''));
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    }
                });

                // Delete document from database
                await architectureWorksCollection.deleteOne(query);
                res.json({ message: "Work deleted successfully" });

            } catch (error) {
                console.error("Error deleting work:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });

        // app.delete('/works/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) };
        //     const result = await architectureWorksCollection.deleteOne(query);
        //     console.log(result);
        //     res.send(result);
        // })
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

        })
        app.post('/members', upload.fields([{ name: "image", maxCount: 1 }]), async (req, res) => {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const { name, designation, description } = req.body;
            const image = req.files?.image ? `${baseUrl}/uploads/${req.files.image[0].filename}` : null;
            const newMember = { name, designation, image, description };
            const result = await architectureMembersCollection.insertOne(newMember);
            res.send(result);

        })

        // app.post('/members', async (req, res) => {
        //     const newMember = req.body;
        //     const result = await architectureMembersCollection.insertOne(newMember);
        //     res.send(result);
        // })

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










