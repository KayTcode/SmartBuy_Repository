import categoryRepository from '../repositories/category.repository.js';

class CategoryController {
    async getAllCategories(req, res) {
        try {
            const categories = await categoryRepository.findAll();
            
            res.status(200).json({
                success: true,
                data: categories,
                count: categories.length
            });
        } catch (error) {
            console.error('Get all categories error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách danh mục',
                error: error.message
            });
        }
    }

    async getCategoryById(req, res) {
        try {
            const { id } = req.params;
            const category = await categoryRepository.findById(id);

            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy danh mục'
                });
            }

            res.status(200).json({
                success: true,
                data: category
            });
        } catch (error) {
            console.error('Get category by ID error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thông tin danh mục',
                error: error.message
            });
        }
    }

    async createCategory(req, res) {
        try {
            const categoryData = req.body;
            const newCategory = await categoryRepository.create(categoryData);

            res.status(201).json({
                success: true,
                message: 'Tạo danh mục thành công',
                data: newCategory
            });
        } catch (error) {
            console.error('Create category error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi tạo danh mục',
                error: error.message
            });
        }
    }

    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const updatedCategory = await categoryRepository.update(id, updateData);

            if (!updatedCategory) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy danh mục'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Cập nhật danh mục thành công',
                data: updatedCategory
            });
        } catch (error) {
            console.error('Update category error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật danh mục',
                error: error.message
            });
        }
    }

    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            const deletedCategory = await categoryRepository.delete(id);

            if (!deletedCategory) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy danh mục'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Xóa danh mục thành công'
            });
        } catch (error) {
            console.error('Delete category error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa danh mục',
                error: error.message
            });
        }
    }
}

export default new CategoryController();
