import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'sales';
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "sales"], required: true },
  isBlocked: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IUser>('User', userSchema);
