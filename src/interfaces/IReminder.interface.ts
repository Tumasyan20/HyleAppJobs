export interface IReminder {
  id_rem: number;
  userId: number;
  name: string;
  description: string;
  deadline: Date;
  time: string;
  done: number;
  repetitions: number;
  attachGoal: number
  createdAt: string;
  updatedAt: string;
  targetDate: string;
}