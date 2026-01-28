import Category from '../models/category.model.js';

class CategoryRepository {
    async findAll() {
        return await Category.find({}).sort('name');
    }

    async findById(id) {
        return await Category.findById(id);
    }

    async findBySlug(slug) {
        return await Category.findOne({ slug });
    }

    async findByName(name) {
        return await Category.findOne({ name });
    }

    async create(categoryData) {
        const category = new Category(categoryData);
        return await category.save();
    }

    async update(id, updateData) {
        return await Category.findByIdAndUpdate(id, updateData, { 
            new: true,
            runValidators: true 
        });
    }

    async delete(id) {
        return await Category.findByIdAndDelete(id);
    }

    async count() {
        return await Category.countDocuments();
    }

    async exists(name) {
        const category = await Category.findOne({ name });
        return !!category;
    }
}

export default new CategoryRepository();
