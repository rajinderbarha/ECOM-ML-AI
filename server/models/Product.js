import { Schema, model } from 'mongoose';

const ProductSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    discount: { type: Number },
    weight: { type: String },
    dimensions: { type: String },
    brand: { type: String, required: true },
    categoryName: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    breadcrumb: { type: String },
    inStock: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    images: [{ type: String }],
    usageFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        required: true,
    },
}, 
    { timestamps: true }
);

// Adding a text index for searchable fields
ProductSchema.index({ name: 'text', description: 'text', brand: 'text', categoryName: 'text', breadcrumb: 'text' });

export default model('Product', ProductSchema);
