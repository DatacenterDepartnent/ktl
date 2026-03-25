import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ILeaveRequest extends Document {
  userId: mongoose.Types.ObjectId;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  attachmentUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LeaveRequestSchema = new Schema<ILeaveRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    leaveType: {
      type: String,
      enum: ['sick', 'personal', 'vacation', 'maternity', 'other'],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    attachmentUrl: { type: String, default: null }, // for medical certificates etc.
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

export const LeaveRequest: Model<ILeaveRequest> =
  mongoose.models.LeaveRequest || mongoose.model<ILeaveRequest>('LeaveRequest', LeaveRequestSchema);
