import cron from 'node-cron';
import remindersModel from '../models/reminders.model';
import notificationsModel from '../models/notifications.model';
import tasksModel from '../models/tasks.model';
import goalsModel from '../models/goals.model';
import habitsModel from '../models/habits.model';
import {IReminder} from "../interfaces/IReminder.interface";
import {NotificationTypesEnum} from "../enums/notificationTypes.enum";
import {IDataForNotification} from "../interfaces/IDataForNotification.interface";

class JobsController {
  startSchedule() {

    cron.schedule('46 15 * * *', () => {
      this.sendNotificationsForTasks();
      this.sendNotificationsForHabits();
    })

    cron.schedule('*/1 * * * *', () => {
      this.sendMinuteNotificationsForReminders();
      this.sendHourNotificationsForReminders();
      this.sendNotificationsForMinuteGoals();
      this.sendNotificationsForHourGoals();
    })
  }

  sendMinuteNotificationsForReminders = async(): Promise<void> => {
      try {
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

        await notificationsModel.sendPushToUsers(dataForNotifications);
        await notificationsModel.addNotificationsToUsers(dataForNotifications);
      }
      catch (e) {
        console.error("sendMinuteNotificationsForReminders ERROR: ", e);
      }

  }

  sendHourNotificationsForReminders = async(): Promise<void> => {
    try {
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

      await notificationsModel.sendPushToUsers(dataForNotifications);
      await notificationsModel.addNotificationsToUsers(dataForNotifications);
    }
    catch (e) {
      console.error("sendHourNotificationsForReminders ERROR: ", e);
    }
  }

  sendNotificationsForTasks = async() : Promise<void> => {
    try {
      const closestTasks = await tasksModel.getClosestTasks();

      const dataForNotifications: Array<IDataForNotification> = [];

      for(const task of closestTasks) {
        dataForNotifications.push({
          userId: task.userId,
          name: task.name,
          description: task.description,
          deadline: task.deadline.toISOString().slice(0, 19).replace('T', ' '),
          type: NotificationTypesEnum.TASKS
        })
      }

      await notificationsModel.sendPushToUsers(dataForNotifications);
      await notificationsModel.addNotificationsToUsers(dataForNotifications);
    }
    catch (e) {
      console.error("sendNotificationsForTasks ERROR: ", e);
    }
  }

  sendNotificationsForMinuteGoals = async(): Promise<void> => {
    try {
      const closestGoals = await goalsModel.getClosestMinuteGoals();
      const dataForNotifications: Array<IDataForNotification> = [];

      if(!closestGoals || !closestGoals.length) return;

      for(const goal of closestGoals) {
        console.log("goal -> ", goal)
        dataForNotifications.push({
          userId: goal.userId,
          name: goal.name,
          description: goal.description,
          deadline: goal.deadline.toISOString().slice(0, 19).replace('T', ' '),
          type: NotificationTypesEnum.GOALS
        })
      }

      await notificationsModel.sendPushToUsers(dataForNotifications);
      await notificationsModel.addNotificationsToUsers(dataForNotifications);
    }
    catch (e) {
      console.error("sendNotificationsForGoals ERROR: ", e);
    }
  }

  sendNotificationsForHourGoals = async(): Promise<void> => {
    try {
      const closestGoals = await goalsModel.getClosestHourGoals();

      const dataForNotifications: Array<IDataForNotification> = [];

      for(const goal of closestGoals) {
        dataForNotifications.push({
          userId: goal.userId,
          name: goal.name,
          description: goal.description,
          deadline: goal.deadline.toISOString().slice(0, 19).replace('T', ' '),
          type: NotificationTypesEnum.GOALS
        })
      }

      await notificationsModel.sendPushToUsers(dataForNotifications);
      await notificationsModel.addNotificationsToUsers(dataForNotifications);
    }
    catch (e) {
      console.error("sendNotificationsForHourGoals ERROR: ", e);
    }
  }

  sendNotificationsForHabits = async(): Promise<void> => {
    try {
      const closestHabits = await habitsModel.getClosestHabits();

      const dataForNotifications: Array<IDataForNotification> = [];

      for(const habit of closestHabits) {
        dataForNotifications.push({
          userId: habit.userId,
          name: habit.name,
          description: habit.description,
          deadline: habit.deadline.toISOString().slice(0, 19).replace('T', ' '),
          type: NotificationTypesEnum.HABITS
        })
      }

      await notificationsModel.sendPushToUsers(dataForNotifications);
      await notificationsModel.addNotificationsToUsers(dataForNotifications);
    }
    catch (e) {
      console.error("sendNotificationsForHourGoals ERROR: ", e);
    }
  }
}

export default new JobsController();