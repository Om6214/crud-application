const express = require("express");
const mongoose = require("mongoose");
const Product = require("./model/productModel");

const port = process.env.PORT | 3000 ;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/blog", (req, res) => {
    res.send("@blog");
});

app.get("/product", async (req, res) => {
    try {
        const product = await Product.find({});
        res.status(200).json(product);
        console.log(product)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get("/product/:productId", async (req, res) => {
    const productId = req.params.productId;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
        console.log(product)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put("/product/:productId", async (req, res) => {
    const productId = req.params.productId;

    try {
        const product = await Product.findByIdAndUpdate(productId, req.body);

        if (!product) {
            return res.status(404).json({ message: `Product not found by id ${productId}`});
        }

        res.status(200).json(product);
        console.log(product)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete("/product/:productId", async(req,res)=>{
    const productId = req.params.productId;

    try {
        const product = await Product.findByIdAndDelete(productId)

        if(!product){
            return res.status(404).json({message : `Cannot find product by id ${productId}`})
        }
    } catch (error) {
        res.status(404).json({ massage:error.message})
    }
})

app.post("/product", async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(200).json(product);
        console.log(product);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

const dbURI = "mongodb+srv://omnath:xursqTvNLZsrTHnS@cluster0.uhkxxty.mongodb.net/api?retryWrites=true&w=majority";


mongoose.connect(dbURI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });




process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB disconnected through app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error occurred while disconnecting MongoDB:', err);
        process.exit(1);
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
