import mongoose, { Document, Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'sales';
  isBlocked: boolean;
  leads?: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "sales"], required: true },
  isBlocked: { type: Boolean, default: false },
  leads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lead' }]
}, { timestamps: true });

export default mongoose.model<IUser>('User', userSchema);
