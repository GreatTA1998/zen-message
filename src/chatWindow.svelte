<div style="width: 410px">
  {#if chatDoc.messages}
    {#each chatDoc.messages as message}
      <div style="display: flex; width: 410px;">
        {#if message.authorUID === currentUser.uid}
          <p style="margin-left: auto; margin-right: 0; margin-bottom: 4px">
            {message.content} 
          </p>
          <p style="font-size: 0.8rem; color: grey; margin-left: 4px; margin-bottom: 0px; margin-top: 18px">
            {' ' + displayDate(message.timestamp)}
          </p>
        {:else}
          <p style="margin-right: 4px; margin-left: 0; margin-bottom: 4px">
            {message.content}
          </p>
          <p style="font-size: 0.8rem; color: grey; margin-left: 0; margin-right: auto; margin-top: 18px">
            {' ' + displayDate(message.timestamp)}
          </p>
        {/if}
      </div>
    {/each}
  {/if}

  <!-- border-box needed otherwise 410px <input> isn't equivalent to 410px on <button> -->
  <input 
    style="width: 405px; box-sizing: border-box" 
    placeholder="Type message here..." 
    bind:value={newMessage}
    bind:this={MessageField}
  >

  <div style="display: flex; margin-top: 10px; align-items: center;">
    <div style="color: grey;">Want reply:</div> 
    {#each replyTimingOptions as replyTimingOption}
      <div on:click={() => replyWithin = replyTimingOption} 
        class:highlighted-box={replyWithin === replyTimingOption} 
        class="clickable-option" 
        style="margin-left: 20px;">
        {replyTimingOption}
      </div>
    {/each}
  </div>

  <button on:click={sendMessage} style="margin-top: 12px; height: 30px; width: 405px;">
    Send message
  </button>
</div>

<script>
  export let friendUID
  export let currentUser
  export let chatRoomID

  import { where, getDoc, getDocs, query, collection, doc, updateDoc, arrayUnion, onSnapshot, arrayRemove } from 'firebase/firestore'
  import db from './db';
  import { onMount } from 'svelte'
  import { displayDate } from './helpers.js'

  import { getFunctions, httpsCallable } from "firebase/functions";
  import { updateCurrentUser } from 'firebase/auth';

  const functions = getFunctions()
  const sendTextMessage = httpsCallable(functions, 'sendTextMessage');

  let MessageField
  let chatID
  let newMessage
  let replyTimingOptions = ['real-time', 'today', 'this week', 'any time']
  let replyWithin = 'any time'
  let unsub
  let chatDoc = { messages: [] }

  onMount(() => {
    MessageField.focus()

    unsub = onSnapshot(doc(db, 'chats', chatRoomID), (snap) => {
      console.log("Current data: ", snap.data());
      if (snap.data()) {
        chatDoc = snap.data()

        // mark chat as read
        const myRef = doc(db, 'users', currentUser.uid)
        updateDoc(myRef, {
          friendUIDsWithNewMessages: arrayRemove(chatRoomID)
        })
      }
    });
    // const q = query(ref, where('participantUIDs', 'array-contains', friendUID))
    // getDocs(q).then(result => {
    //   console.log('result =', result)
    //   console.log('result.docs.length should be 1 =', result.docs.length)
    //   result.docs.forEach(doc => {
    //     console.log('doc =', doc)
    //     if (doc.data().participantUIDs.includes(currentUser.uid)) {
    //       chatID = doc.id
    //     }
    //   })
    // })
  })

  async function sendMessage () {
    console.log('sendMessage()')
    const ref = doc(db, 'chats', chatRoomID)
    updateDoc(ref, {
      messages: arrayUnion({
        content: newMessage,
        timestamp: Date.now(),
        authorUID: currentUser.uid
      })
    })

    // somehow visibly show there's a new message in that chat room 
    // const [otherPersonUID] = chatDoc.participantUIDs.filter(uid => uid !== currentUser.uid)
    // const otherPersonUID = currentUser.uid
    const personRef = doc(db, 'users', friendUID)
    updateDoc(personRef, {
      friendUIDsWithNewMessages: arrayUnion(chatRoomID)
    })  

    // get the other person's phone number
    const otherPersonSnap = await getDoc(personRef)

    // HANDLE SMS NOTIFICATION
    switch (replyWithin) {
      case 'any time': 
        break
      case 'real-time': 
        console.log('sending text to ,', otherPersonSnap.data().phoneNumber)
        sendTextMessage({ 
          content: `${currentUser.name} wrote "${newMessage}"`,
          toWho: otherPersonSnap.data().phoneNumber
        })
      case 'today':
        // create an scheduled deadline for that person
        // leave this for the future
      case 'this week':
        // create a trap such that, if the person doesn't reply within the deadline, the function will send a notification
        // can leave this for the future
      default: 
        break
    }

    newMessage = ''
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
