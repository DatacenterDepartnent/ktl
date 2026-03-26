import { ObjectId } from 'mongodb';

export interface ILeaveRequest {
  _id?: ObjectId;
  userId: ObjectId;
  leaveType: 'sick' | 'personal' | 'vacation' | 'maternity' | 'other';
  startDate: Date;
  endDate: Date;
  reason: string;
  attachmentUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
