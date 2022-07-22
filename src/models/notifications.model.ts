import mysql from '../db/mysql/mysql.db';
import axios from 'axios';
import firebaseServiceAccount from '../data/firebaseServiceAccount.json';
import {googleJwtClient} from "../configs/googleAuth.configs";
import {IDataForNotification} from "../interfaces/IDataForNotification.interface";
import {IUserToken} from "../interfaces/IUserToken.interface";

class NotificationsModel {
  sendPushToUsers = async (notificationsData: Array<IDataForNotification>): Promise<void> => {
    console.log({notificationsData})
    const [rows] = await mysql.client.query("CALL getUsersFirebaseTokens(?)", [
      notificationsData.map(data => {
        return data.userId
      }).join(',')
    ]);

    const userTokens: Array<IUserToken> = rows[0];

    console.log("tokens -> ", userTokens)

    if (userTokens.length) {
      googleJwtClient.authorize(async (error, tokens) => {
        if (error) {
          console.log("Error making request to generate access token:", error);
        } else if (tokens.access_token === null) {
          console.log("Provided service account does not have permission to generate access tokens");
        } else {
          const accessToken = tokens.access_token;


          for (const data of notificationsData) {
            try {
              const notification = {
                title: data.name,
                body: data.description
              }
              console.log("Data -> ", notification)
              const tokenData = userTokens.find(token => {return token.userId = data.userId})
              await axios.post(
                  'https://fcm.googleapis.com/v1/projects/'+ firebaseServiceAccount.project_id +'/messages:send',
                  {
                    message: {
                      token: tokenData.token,
                      notification
                    }
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      "accept": "application/json",
                      "Authorization": "Bearer " + accessToken
                    }
                  }
              )
              // await addDelay(100);
            } catch (e) {
              console.error("FirebaseController -> sendNotification -> jwtClient.authorize ERROR: ", JSON.stringify(e));
            }
          }
        }
      })
    }
  }

  addNotificationsToUsers = async(notificationData: Array<IDataForNotification>): Promise<void> => {
    await mysql.client.query("CALL addNotificationsToUsers(?)", [
      JSON.stringify(notificationData)
    ])
  }
}

export default new NotificationsModel();