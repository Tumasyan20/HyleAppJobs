import cron from 'node-cron';
import remindersModel from '../models/reminders.model';
import notificationsModel from '../models/notifications.model';
import {IReminder} from "../interfaces/IReminder.interface";
import {NotificationTypesEnum} from "../enums/notificationTypes.enum";
import {IDataForNotification} from "../interfaces/IDataForNotification.interface";

class JobsController {
  startSchedule() {
    // setInterval(() => {
    //   this.sendMinuteNotifications()
    // }, 5000)
      cron.schedule('*/1 * * * *', () => {
        console.log("start")
        this.sendMinuteNotifications()
        this.sendHourNotifications()
      })

    // this.sendMinuteNotifications()

  }

  sendMinuteNotifications = async(): Promise<void> => {
      console.log("starting send minute notifications")
      const closestNotifications: Array<IReminder> = await remindersModel.getClosestRemindersForMinute();

      const dataForNotifications: Array<IDataForNotification> = [];

      for(const reminder of closestNotifications) {

          dataForNotifications.push({
            userId: reminder.userId,
            name: reminder.name,
            description: reminder.description,
            deadline: new Date().toISOString().slice(0, 19).replace('T', ' '),
            type: NotificationTypesEnum.REMINDERS
          });
      }

      console.log("data for notifications min", dataForNotifications)

      await notificationsModel.sendPushToUsers(dataForNotifications);
      await notificationsModel.addNotificationsToUsers(dataForNotifications);

  }

  sendHourNotifications = async(): Promise<void> => {
    console.log("Starting send hour notifications")
    const closestNotifications: Array<IReminder> = await remindersModel.getClosestRemindersForHour();

    const dataForNotifications: Array<IDataForNotification> = [];

    for(const reminder of closestNotifications) {

      dataForNotifications.push({
        userId: reminder.userId,
        name: reminder.name,
        description: reminder.description,
        deadline: new Date(new Date().setHours(new Date().getHours() + 2))
            .toISOString().slice(0, 19).replace('T', ' '),
        type: NotificationTypesEnum.REMINDERS
      });
    }

    console.log("data for notifications hr", dataForNotifications)

    await notificationsModel.sendPushToUsers(dataForNotifications);
    await notificationsModel.addNotificationsToUsers(dataForNotifications);
  }
}

export default new JobsController();