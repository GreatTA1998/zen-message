<div>
  <h1>Chat: {friendUID}</h1>

  <input style="width: 100%" placeholder="Type message here..." bind:value={newMessage}>
  <button on:click={sendMessage}>Send</button>

  <div style="display: flex; justify-content: space-evenly">
    <div>
      ASAP
    </div>
    <div>
      1 hour 
    </div>
    <div>
      Today
    </div>
    <div>
      This week
    </div>
    <div>
      Anytime
    </div>
  </div>
</div>

<script>
  export let friendUID

  import { where, getDocs, query, collection, doc, updateDoc, arrayUnion } from 'firebase/firestore'
  import db from './db';

  let allMessages
  let chatID
  let newMessage

  $: if (friendUID) {
    const ref = collection(db, 'chats')
    const q = query(ref, where('participantUIDs', 'array-contains', friendUID))
    getDocs(q).then(result => {
      console.log('result =', result)
      // .docs should only have length = 1
      result.docs.forEach(doc => {
        console.log('doc =', doc)
        chatID = doc.id
        allMessages = doc.data().messages
        console.log('allMessages =', allMessages)
      })
    })
  }

  function sendMessage () {
    alert('Send message, chat ID =' + chatID)
    console.log('new message =', newMessage)
    const ref = doc(db, 'chats', chatID)
    updateDoc(ref, {
      messages: arrayUnion()
    })
  }
</script>