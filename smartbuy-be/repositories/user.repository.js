import User from '../models/user.model.js';

class UserRepository {
    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async findById(id) {
        return await User.findById(id);
    }

    async findByGoogleId(googleId) {
        return await User.findOne({ googleId });
    }

    async create(userData) {
        const user = new User(userData);
        return await user.save();
    }

    async update(id, updateData) {
        return await User.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
        return await User.findByIdAndDelete(id);
    }

    async findAll() {
        return await User.find({});
    }

    async findOrCreateGoogleUser(profile) {
        let user = await this.findByGoogleId(profile.googleId);
        
        if (!user) {
            // Check if user exists with same email
            user = await this.findByEmail(profile.email);
            
            if (user) {
                // Link Google account to existing user
                user.googleId = profile.googleId;
                user.avatar = profile.avatar || user.avatar;
                await user.save();
            } else {
                // Create new user
                user = await this.create({
                    email: profile.email,
                    name: profile.name,
                    googleId: profile.googleId,
                    avatar: profile.avatar,
                    authProvider: 'google'
                });
            }
        }
        
        return user;
    }
}

export default new UserRepository();
