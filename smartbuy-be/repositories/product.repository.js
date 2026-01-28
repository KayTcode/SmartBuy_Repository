import Product from '../models/product.model.js';

class ProductRepository {
    async findAll(filter = {}, options = {}) {
        const { sort = '-createdAt', skip = 0, limit = 20 } = options;
        return await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);
    }

    async findById(id) {
        return await Product.findById(id);
    }

    async findOne(filter) {
        return await Product.findOne(filter);
    }

    async create(productData) {
        const product = new Product(productData);
        return await product.save();
    }

    async update(id, updateData) {
        return await Product.findByIdAndUpdate(id, updateData, { 
            new: true,
            runValidators: true 
        });
    }

    async delete(id) {
        return await Product.findByIdAndDelete(id);
    }

    async count(filter = {}) {
        return await Product.countDocuments(filter);
    }

    async findByCategory(category, options = {}) {
        const { limit = 20, sort = '-createdAt' } = options;
        return await Product.find({ category })
            .sort(sort)
            .limit(limit);
    }

    async findFeatured(limit = 8) {
        return await Product.find({ featured: true })
            .sort('-createdAt')
            .limit(limit);
    }

    async findBestSellers(limit = 8) {
        return await Product.find({ status: { $ne: 'out-of-stock' } })
            .sort('-rating -reviews')
            .limit(limit);
    }

    async findOnSale(limit = 10) {
        return await Product.find({ 
            status: 'discount',
            oldPrice: { $exists: true, $ne: null }
        })
            .sort('-createdAt')
            .limit(limit);
    }

    async findByBMICategory(bmiCategory, limit = 10) {
        return await Product.find({ 
            bmiCategories: bmiCategory,
            status: { $ne: 'out-of-stock' }
        })
            .sort('-rating')
            .limit(limit);
    }

    async findRelated(productId, category, limit = 4) {
        return await Product.find({
            _id: { $ne: productId },
            category: category,
            status: { $ne: 'out-of-stock' }
        })
            .sort('-rating')
            .limit(limit);
    }

    async getStatsByCategory() {
        return await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);
    }

    async updateStock(id, quantity) {
        return await Product.findByIdAndUpdate(
            id,
            { $inc: { stock: quantity } },
            { new: true }
        );
    }

    async search(searchTerm, filter = {}, options = {}) {
        const { sort = '-createdAt', skip = 0, limit = 20 } = options;
        
        const searchFilter = {
            ...filter,
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { category: { $regex: searchTerm, $options: 'i' } },
                { tags: { $in: [new RegExp(searchTerm, 'i')] } }
            ]
        };

        return await Product.find(searchFilter)
            .sort(sort)
            .skip(skip)
            .limit(limit);
    }
}

export default new ProductRepository();
