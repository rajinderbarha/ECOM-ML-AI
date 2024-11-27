import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
    name: {type: String , unique: true}
})

const SubCategory = mongoose.model('SubCategory', subCategorySchema);
export default SubCategory