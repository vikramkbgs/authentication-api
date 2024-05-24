// models/user.js
const mongoose = require('mongoose');

if (!mongoose.models.User) {
  const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    bio: {
      type: String,
      default: ' '
    },
    phone: {
      type: String,
      default: ' '
    },
    profilePictureUrl: {
      type: String,
      default: ' '
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  });

  mongoose.model('User', userSchema);
}

module.exports = mongoose.model('User');
