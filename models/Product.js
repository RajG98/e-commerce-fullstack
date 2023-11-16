const  mongoose = require("mongoose");



const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    images: [{ type: String }],
    category:{type:mongoose.Types.ObjectId,ref:'Category'}
});

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
