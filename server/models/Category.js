import { Schema, model } from 'mongoose';

const CategorySchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    breadcrumb: { type: String, required: true }
});

export default model('Category', CategorySchema);
