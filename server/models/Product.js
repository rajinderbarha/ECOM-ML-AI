import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  title: String,
  category_id: Schema.Types.ObjectId,
  category_name: String,
  sub_category_id: Schema.Types.ObjectId,
  sub_category_name: String,
  brand_id: Schema.Types.ObjectId,
  brand_name: String,
  sale_price: Number,
  market_price: Number,
  type_id: Schema.Types.ObjectId,
  type_name: String,
  rating: Number,
  description: String,
});

const Product = model('Product', productSchema);

export default Product;
