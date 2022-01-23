import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
//we want to compare a particular user's password and the password already stored in the database for that user.
userSchema.methods.matchPassword = async function (enteredPasssword) {
  return await bcrypt.compare(enteredPasssword, this.password); //so this this.password refers to the password of a particular user.
  // as we are calling matchPassword on that specific user.
};

// so here we are encrypting the password before the user model gets saved.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
