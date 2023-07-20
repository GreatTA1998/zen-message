const functions = require("firebase-functions");
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const adminCredentials = require("./adminCredentials.json");
const { getFirestore } = require('firebase-admin/firestore')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

initializeApp({
  credential: applicationDefault()
})
const db = getFirestore()

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
// use gcloud shell to read logs
// force run function for testing: https://console.cloud.google.com/cloudscheduler?jobs-tablequery=%255B%257B%2522k%2522%253A%2522name%2522%252C%2522t%2522%253A10%252C%2522v%2522%253A%2522firebase-schedule-scheduledFunction-us-central1%2522%252C%2522s%2522%253Atrue%257D%255D&project=project-z-e00fd&authuser=0&hl=en

// or try to adjust it for each person's timezone, but start with US eastern time
// exports.scheduledFunction = functions.pubsub.schedule('every 12 hours').onRun(async (context) => {
//   const usersRef = db.collection('users')
//   const snapshot = await usersRef.get()
//   if (snapshot.empty) {
//     return null
//   }

//   snapshot.docs.forEach(async (userDoc) => {
//       const user = userDoc.data()
//       functions.logger.log('user =', user)
//       let summaryOfMessages = []

//       for (const friendUID of user.friendUIDsWithNewMessages) {
//         functions.logger.log("friendUID", friendUID)
//         const chatID = user.uid < friendUID ? (user.uid + friendUID) : (friendUID + user.uid)
//         const chatRef = db.doc(`chats/${chatID}`)
//         const chatResult = await chatRef.get()
//         const chatObj = chatResult.data()

//         functions.logger.log("chatObj =", chatObj)
//         const friendName = user.friends.filter(f => f.uid === friendUID)[0].name
//         const mostRecentMessage = chatObj.messages[chatObj.messages.length - 1].content

//         summaryOfMessages.push(`${friendName}: "${mostRecentMessage}"`)
//       }
//       // send a text
//       // to use the function we already have https://stackoverflow.com/a/60470745/7812829
//         client.messages 
//           .create({        
//               body: 'ZEN-MESSAGE: Today, you received these messages' + summaryOfMessages.join(', '),
//               messagingServiceSid: 'MGe595615f66055b9ee88ac19a9d0ddce5',
//               to: user.phoneNumber
//             }) 
//           .then(message => console.log('sent to =', user.phoneNumber)) 
//           .done();
//   })
//   return null;
// })


// grammar i 'minute hour day_of_month month day_of_week'
exports.scheduledFunctionCrontab = functions.pubsub.schedule('10 17 * * *')
  .timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
  .onRun(async (context) => {
  console.log('This will be run every day at 17:10 Eastern!');

  const usersRef = db.collection('users')
  const snapshot = await usersRef.get()
  if (snapshot.empty) {
    return null
  }

  snapshot.docs.forEach(async (userSnap) => {
      const user = userSnap.data()
      functions.logger.log('user =', user)
      let summaryOfMessages = []

      for (const friendUID of user.friendUIDsWithNewMessages) {
        functions.logger.log("friendUID", friendUID)
        const chatID = user.uid < friendUID ? (user.uid + friendUID) : (friendUID + user.uid)
        const chatRef = db.doc(`chats/${chatID}`)
        const chatResult = await chatRef.get()
        const chatObj = chatResult.data()

        functions.logger.log("chatObj =", chatObj)
        const friendName = user.friends.filter(f => f.uid === friendUID)[0].name
        const mostRecentMessage = chatObj.messages[chatObj.messages.length - 1].content

        summaryOfMessages.push(`${friendName}: "${mostRecentMessage}"`)
      }
      // send a text
      // to use the function we already have https://stackoverflow.com/a/60470745/7812829
      
      let textContent
      if (summaryOfMessages.length === 0) {
        textContent = "zen-message: no messages today, have a great day"
      } 
      else {
        textContent = `zen-message: today ${summaryOfMessages.length} people sent messages: '` 
        + summaryOfMessages.join(', ') 
        + `. https://zen-message.com/${userSnap.data().uid}`
      }

      client.messages 
        .create({        
            body: textContent,
            messagingServiceSid: 'MGe595615f66055b9ee88ac19a9d0ddce5',
            to: user.phoneNumber
          }) 
        .then(message => console.log('sent to =', user.phoneNumber)) 
        .done();
  })




  return null;
});
