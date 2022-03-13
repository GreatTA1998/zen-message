<div>
  {#each chatDoc.messages as message}
    <div style="display: flex;">
      <p>{message.content}</p>
      <p style="margin-left: auto; margin-right: 0;">{displayDate(message.timestamp)}</p>
    </div>
  {/each}

  <input style="width: 100%" placeholder="Type message here..." bind:value={newMessage}>

  <div style="display: flex; margin-top: 10px; align-items: center;">
    <div style="color: grey;">Need a reply:</div> 
    {#each replyTimingOptions as replyTimingOption}
      <div on:click={() => replyWithin = replyTimingOption} 
        class:highlighted-box={replyWithin === replyTimingOption} 
        class="clickable-option" 
        style="margin-left: 20px;">
        {replyTimingOption}
      </div>
    {/each}
  </div>

  <button on:click={sendMessage} style="margin-top: 12px; height: 30px; width: 410px;">Send message</button>
</div>

<script>
  export let friendUID
  export let currentUser

  import { where, getDocs, query, collection, doc, updateDoc, arrayUnion, onSnapshot, arrayRemove } from 'firebase/firestore'
  import db from './db';
  import { onMount } from 'svelte'
  import { displayDate } from './helpers.js'

  let chatID
  let newMessage
  let replyTimingOptions = ['real-time', 'today', 'this week', 'anytime']
  let replyWithin = 'anytime'
  let unsub
  let chatDoc = { messages: [] }

  onMount(() => {
    const ref = collection(db, 'chats')
    const q = query(ref, where('participantUIDs', 'array-contains', friendUID))
    getDocs(q).then(result => {
      console.log('result =', result)
      result.docs.forEach(doc => {
        console.log('doc =', doc)
        if (doc.data().participantUIDs.includes(currentUser.uid)) {
          chatID = doc.id
        }
      })

      unsub = onSnapshot(doc(db, 'chats', chatID), (snap) => {
        console.log("Current data: ", snap.data());
        chatDoc = snap.data()

        // mark chat as read
        const myRef = doc(db, 'users', currentUser.uid)
        updateDoc(myRef, {
          friendUIDsWithNewMessages: arrayRemove(chatID)
        })
      });
    })
  })

  function sendMessage () {
    console.log('sendMessage()')
    const ref = doc(db, 'chats', chatID)
    updateDoc(ref, {
      messages: arrayUnion({
        content: newMessage,
        timestamp: Date.now()
      })
    })
    newMessage = ''

    // somehow visibly show there's a new message in that chat room 
    const [otherPersonUID] = chatDoc.participantUIDs.filter(uid => uid !== currentUser.uid)
    // const otherPersonUID = currentUser.uid
    const personRef = doc(db, 'users', otherPersonUID)
    updateDoc(personRef, {
      friendUIDsWithNewMessages: arrayUnion(chatID)
    })  

    // HANDLE SMS NOTIFICATION
    // find the other person who will receive the message
    // calculate whether to send a text, and if so when
    switch (replyWithin) {
      case 'anytime': return
      case 'real-time': 
        console.log('ASAP, sending text immediately')
      case 'today':
        // create an scheduled deadline for that person
        // leave this for the future
      case 'this week':
        // create a trap such that, if the person doesn't reply within the deadline, the function will send a notification
        // can leave this for the future
    }
  }
</script>

<style>
  .highlighted-box {
    color: orange;
    border-style: solid !important;
  }

  .clickable-option {
    border-style: dotted;
    padding: 3px;
  }

  .blue-badge {
    background-color: blue;
  }
</style>
