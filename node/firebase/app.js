const admin = require("firebase-admin");
const path  = require('path');
const serviceAccount = require(path.join(__dirname, '../', 'firebase-admin-key.json'));

const app =admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});


async function main () {
  const db = app.firestore();
  const querySnapshot = await db
    .collection('users')
    // .where('fakeAccessToken', '==', '123access')
    .get();
  const users = querySnapshot.docs.map(x => {
    const data = x.data();
    data.id = x.id;
    return data;
  })  
  console.log(users);
}

main()
