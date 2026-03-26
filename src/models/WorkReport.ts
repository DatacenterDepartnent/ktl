import { ObjectId } from 'mongodb';

export interface IWorkReport {
  _id?: ObjectId;
  userId: ObjectId;
  date: Date;
  activities: {
    taskName: string;
    detail?: string;
    status: 'Completed' | 'In Progress' | 'Pending';
  }[];
  summary: string;
  problems?: string;
  plansNextDay?: string;
  createdAt: Date;
  updatedAt: Date;
}
