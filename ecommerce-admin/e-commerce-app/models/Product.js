const  mongoose = require("mongoose");



const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
});

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
