import { ObjectId } from 'mongodb';

export interface IAttendance {
  _id?: ObjectId;
  userId: ObjectId;
  date: Date;
  checkIn: {
    time?: Date;
    location?: { lat: number; lng: number; address?: string };
    photoUrl?: string;
    statusTag?: 'In-Site' | 'Remote';
    deviceId?: string;
  };
  checkOut: {
    time?: Date;
    location?: { lat: number; lng: number; address?: string };
    photoUrl?: string;
    otHours: number;
  };
  status: 'Present' | 'Late' | 'Leave' | 'Absent';
  createdAt: Date;
  updatedAt: Date;
}
