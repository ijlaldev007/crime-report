import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [60, 'Name cannot be more than 60 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent mongoose from creating the model multiple times
export const User = mongoose.models.User || mongoose.model('User', UserSchema);