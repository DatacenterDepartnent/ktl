import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  checkIn: {
    time?: Date;
    location?: { lat: number; lng: number; address?: string };
    photoUrl?: string;
    statusTag?: string;
    deviceId?: string;
  };
  checkOut: {
    time?: Date;
    location?: { lat: number; lng: number; address?: string };
    photoUrl?: string;
    otHours: number;
  };
  status: string;
}

const AttendanceSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  checkIn: {
    time: { type: Date },
    location: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String }
    },
    photoUrl: { type: String },
    statusTag: { type: String, enum: ['In-Site', 'Remote'] },
    deviceId: { type: String }
  },
  checkOut: {
    time: { type: Date },
    location: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String }
    },
    photoUrl: { type: String },
    otHours: { type: Number, default: 0 }
  },
  status: { type: String, enum: ['Present', 'Late', 'Leave', 'Absent'], default: 'Present' }
}, { timestamps: true });

AttendanceSchema.index({ userId: 1, date: 1 });

export default mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);
