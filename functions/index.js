const functions = require("firebase-functions");
const { initializeApp } = require('firebase-admin/app');
const adminCredentials = require("./adminCredentials.json");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const accountSid = functions.config().twilio.accountsid
const authToken = functions.config().twilio.authtoken

const client = require('twilio')(accountSid, authToken)

exports.sendTextMessage = functions.https.onCall((data, context) => {
  const { content, toWho } = data;
  console.log('content =', content)
  console.log("toWho =", toWho)
  client.messages 
    .create({        
        body: content,
        messagingServiceSid: 'MGe595615f66055b9ee88ac19a9d0ddce5',
        to: toWho
      }) 
    .then(message => console.log('sent to =', toWho)) 
    .done();
});


// test local cloud environment
// try `every 24 hours`
exports.scheduledFunction = functions.pubsub.schedule('every 5 minutes').onRun(async (context) => {
  console.log('This will be run every 5 minutes!');

  const firestore = admin.firestore()
  const usersRef = firestore.collection('users')
  const result = await usersRef.get()
  if (result.exists) {
      result.docs.forEach(userDoc => {
          const user = userDoc.data()
          let summaryOfMessages = []
          for (const friendUID of user.friendUIDsWithNewMessages) {
            const chatID = user.uid < friendUID ? (user.uid + friendUID) : (friendUID + user.uid)
            const chatRef = firestore.doc(`chats/${chatID}`)
            const chatResult = await chatRef.get() 
            const chatObj = chatResult.data()
            const mostRecentMessage = chatObj.messages[chatObj.messages.length - 1]
            summaryOfMessages.push(mostRecentMessage)
          }
          // send a text
          // to use the function we already have https://stackoverflow.com/a/60470745/7812829
            client.messages 
            .create({        
                body: summaryOfMessages.join(''),
                messagingServiceSid: 'MGe595615f66055b9ee88ac19a9d0ddce5',
                to: user.phoneNumber
              }) 
            .then(message => console.log('sent to =', user.phoneNumber)) 
            .done();
      })
  }
  return null;
})




