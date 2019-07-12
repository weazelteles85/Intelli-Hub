import * as functions from 'firebase-functions';
//import * as express from 'express';
//import { adminSDK } from './environments/environments';
//import * as ClientOAuth2 from 'client-oauth2';

const cors = require('cors')({ origin: true })
// Google APIs

//const readline = require('readline');
const {google} = require('googleapis');
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/admin.directory.group.member'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
//const TOKEN_PATH = 'token.json';


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
        
        


        // const appAuth = new ClientOAuth2({
        //     clientId: request.body.client_id,
        //     clientSecret: request.body.private_key,
        //     accessTokenUri: request.body.token_uri,
        //     authorizationUri: request.body.auth_uri,
        //     redirectUri: request.body.redirectUri,
        //     scopes: ['https://www.googleapis.com/auth/admin.directory.group.member', 'https://www.googleapis.com/auth/admin.directory.group']
        // });

    //     const token = appAuth.createToken('accessToken', 'refreshToken', {});
    //     token.refresh({'headers': headers}).then((refreshToken) => {
    //        response.status(200).send(refreshToken);
    //    }).catch((err) => {
    //        response.status(455).send('Refresh Failed ' + err);
    //    })
    })
})

