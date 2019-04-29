import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FlUser } from '../../src/app/core/User.interface';

const cors = require('cors')({ origin: true })
const db = admin.firestore();

export const createUser = functions.https.onRequest((request, response) => {
    cors(request, response, () => {

        const user:FlUser = {
            _fl_meta_: {
                createdBy: request.body.createdBy,
                createdDate: new Date(),
                docId: ''
            },
            client: request.body.client,
            displayName: request.body.displayName,
            email: request.body.email,
            enabled: request.body.enabled,
            firstName: request.body.firstName,
            id: '',
            lastName: request.body.lastName,
            locations: request.body.locations,
            permissions: request.body.permissions,
            permissionsList: request.body.permList
        };
        console.log(user);

        admin.auth().createUser({
            email: request.body.email,
            emailVerified: false,
            password: request.body.password,
            displayName: request.body.displayName,
            disabled: false
        }).then((userRecord) => {
            user._fl_meta_ = {
                createdBy: request.body.createdBy,
                createdDate: new Date(),
                docId: userRecord.uid
            };
            user.id = userRecord.uid;
            db.doc(`fl_users/${userRecord.uid}`).set(user, { merge: true }).then(
                (msg) => {
                    console.log('Created New User Data');
                    return response.status(200).send('New User Created');
                }
            ).catch((err) => {
                console.error('There was a problem creating the User Database: ' + err)
                return response.status(400).send('There was a problem creating the User Database: ' + err)
            })
        }).catch((err) => {
            console.error('There was a problem creating the User: ' + err)
            return response.status(400).send('There was a problem creating the User: ' + err)
        })

    })
})