<script context="module">
  export function load ({ params }) {
    return {
      props: {
        uid: params.uid,
      }
    }
  }  
</script>

<input 
  style="width: 300px; box-sizing: border-box" 
  placeholder="Type message here..." 
  bind:value={newMessage}
  bind:this={MessageField}
>

<div>
  <input 
    placeholder="Your name e.g. John"
    bind:value={senderName}
  >
</div>

<button on:click={sendMessage} style="margin-top: 12px; height: 30px; width: 300px;">
  Send message
</button>

<div>Or create an account</div>
{#if !$user}
  <PhoneLogin canTakeInternationalNumbers/>
{/if}

<script>
  import { user } from '../store.js'
  import PhoneLogin from '../PhoneLogin.svelte'
  import { doc, updateDoc } from "firebase/firestore";
  import { arrayUnion } from 'firebase/firestore'
  import db from "../db.js"

  export let uid

  let newMessage = ''
  let senderName = ''
  let MessageField
  
  console.log('uid =', uid)

  function sendMessage () {
    if (!senderName || !newMessage) {
      alert('Need both message and name')
      return
    }

    const userRef = doc(db, 'users', uid)
    updateDoc(userRef, {
      messageRequestNames: arrayUnion(senderName),
      messageRequestObjects: arrayUnion({
        content: newMessage,
        senderName
      })
    }) 
    alert('updated user')
  }
</script>