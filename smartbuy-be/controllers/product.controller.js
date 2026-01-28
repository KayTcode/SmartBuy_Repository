import Product from '../models/product.model.js';
import httpErrors from 'http-errors';

class ProductController {
    async getAllProducts(req, res, next) {
    try {
        const {
            category,
            minPrice,
            maxPrice,
            minRating,
            tags,
            status,
            featured,
            search,
            sort = '-createdAt',
            page = 1,
            limit = 100
        } = req.query;

        // Build filter
        const filter = {};

        if (category && category !== 'all') {
            filter.category = category;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (minRating) {
            filter.rating = { $gte: Number(minRating) };
        }

        if (tags) {
            const tagArray = Array.isArray(tags) ? tags : tags.split(',');
            filter.tags = { $in: tagArray };
        }

        if (status) {
            filter.status = status;
        }

        if (featured !== undefined) {
            filter.featured = featured === 'true';
        }

        if (search) {
            filter.$text = { $search: search };
        }

        // Execute query
        const skip = (page - 1) * limit;
        const products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        const total = await Product.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
    }

    async getProductById(req, res, next) {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            throw httpErrors.NotFound('Product not found');
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
    }

    async getFeaturedProducts(req, res, next) {
    try {
        const limit = req.query.limit || 8;
        const products = await Product.find({ featured: true })
            .sort('-rating')
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        next(error);
    }
    }

    async getProductsByCategory(req, res, next) {
    try {
        const { category } = req.params;
        const limit = req.query.limit || 20;

        const products = await Product.find({ category })
            .sort('-rating')
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        next(error);
    }
    }

    async getBestSellers(req, res, next) {
    try {
        const limit = req.query.limit || 8;
        const products = await Product.find({ status: 'in-stock' })
            .sort('-rating -reviews')
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        next(error);
    }
    }

    async getSaleProducts(req, res, next) {
    try {
        const limit = req.query.limit || 10;
        const products = await Product.find({ 
            status: 'discount',
            oldPrice: { $exists: true }
        })
            .sort('-rating')
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        next(error);
    }
    }

    async getProductsByBMI(req, res, next) {
    try {
        const { bmiCategory } = req.params;
        const limit = req.query.limit || 10;

        const products = await Product.find({ 
            bmiCategory: { $in: [bmiCategory, 'all'] }
        })
            .sort('-rating')
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        next(error);
    }
    }

    async getRelatedProducts(req, res, next) {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            throw httpErrors.NotFound('Product not found');
        }

        const relatedProducts = await Product.find({
            _id: { $ne: id },
            category: product.category
        })
            .sort('-rating')
            .limit(4);

        res.status(200).json({
            success: true,
            data: relatedProducts
        });
    } catch (error) {
        next(error);
    }
    }

    async createProduct(req, res, next) {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
    }

    async updateProduct(req, res, next) {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            throw httpErrors.NotFound('Product not found');
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
    }

    async deleteProduct(req, res, next) {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            throw httpErrors.NotFound('Product not found');
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        next(error);
    }
    }

    async getProductStats(req, res, next) {
    try {
        const stats = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    avgPrice: { $avg: '$price' },
                    avgRating: { $avg: '$rating' }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        const totalProducts = await Product.countDocuments();
        const featuredCount = await Product.countDocuments({ featured: true });
        const outOfStockCount = await Product.countDocuments({ status: 'out-of-stock' });

        res.status(200).json({
            success: true,
            data: {
                byCategory: stats,
                total: totalProducts,
                featured: featuredCount,
                outOfStock: outOfStockCount
            }
        });
    } catch (error) {
        next(error);
    }
    }

}

export default new ProductController();
