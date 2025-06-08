import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import dotenv from 'dotenv';
import { storage, cloudinary } from './cloudinary.js';

const app = express();
const PORT = 5000;

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

const upload = multer({ storage: storage });

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  imageUrl: String,
});

const Product = mongoose.model('Product', productSchema);



app.post('/products', upload.single('image'), async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const imageUrl = req.file.path;

    const newProduct = new Product({ name, price, category, imageUrl });
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



app.delete('/products/:name', async (req, res) => {
  try {
    const product = await Product.findOne({ name: req.params.name });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const getPublicIdFromUrl = (url) => {
      const urlParts = url.split('/');
      const fileWithExt = urlParts.pop();
      const fileName = fileWithExt.substring(0, fileWithExt.lastIndexOf('.'));

      const uploadIndex = urlParts.indexOf('upload');
      const publicIdParts = urlParts.slice(uploadIndex + 1);
      if (publicIdParts[0].startsWith('v') && !isNaN(publicIdParts[0].substring(1))) {
        publicIdParts.shift();
      }

      return [...publicIdParts, fileName].join('/');
    };

    const publicId = getPublicIdFromUrl(product.imageUrl);
    await cloudinary.uploader.destroy(publicId);

    const deletedProduct = await Product.findOneAndDelete({ name: req.params.name });

    res.json({ message: "Product and image deleted successfully", deletedProduct });
  } catch (error) {
    console.error("Deletion error:", error);
    res.status(500).json({ message: error.message });
  }
});



app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
