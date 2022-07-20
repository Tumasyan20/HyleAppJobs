import { google } from 'googleapis';
import firebaseServiceAccount from '../data/firebaseServiceAccount.json';

const scopes = [
  "https://www.googleapis.com/auth/firebase.messaging"
];

export const googleJwtClient = new google.auth.JWT(
    firebaseServiceAccount.client_email,
    null,
    firebaseServiceAccount.private_key,
    scopes,
    null
)