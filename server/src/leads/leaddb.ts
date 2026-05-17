import mongoose, { Document, Types } from 'mongoose';

export interface ILead extends Document {
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Lost'], default: 'New' },
  source: { type: String, enum: ['Website', 'Instagram', 'Referral'] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model<ILead>('Lead', leadSchema);
