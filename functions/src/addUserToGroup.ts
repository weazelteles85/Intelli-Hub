import * as functions from 'firebase-functions';

const cors = require('cors')({ origin: true })
const {google} = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/admin.directory.group.member'];


export const addUserToGroup = functions.https.onRequest((request, response) => {
    cors(request, response, () => {

        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }

        const oauth2Client = new google.auth.oauth2(
            '881003242822-87i2l47k8gr3hfvb33g8f6gh1d75boad.apps.googleusercontent.com', 
            'jYor8ImCKcFIKNrNvl4nIrn8', 'http://localhost:4200');

        oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES,
                headers: headers
              });
              
        oauth2Client.getToken((err:any, token:any) => {
                if (err)  {
                    response.status(455).send(err.error);
                } else {
                    oauth2Client.credentials = token;
                    response.status(200).send(token);
                }
              });
    })
})

