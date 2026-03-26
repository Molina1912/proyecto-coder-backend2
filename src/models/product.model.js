import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    thumbnail: { type: String, default: '' },
    code: { type: String, required: true, unique: true },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    status: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);