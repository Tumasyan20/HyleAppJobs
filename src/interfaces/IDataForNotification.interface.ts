import {NotificationTypesEnum} from "../enums/notificationTypes.enum";

export interface IDataForNotification {
  userId: number;
  name: string;
  description: string;
  deadline: string;
  type: NotificationTypesEnum;
  token?: string;
}