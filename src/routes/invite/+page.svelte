

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
  <div style="width: 250px;">
    <PhoneLogin canTakeInternationalNumbers/> 
  </div>
{/if}

<h4 style="margin-left: 12px">Zen Messenger</h4>
<ul style="padding-left: 12px; font-size: 0.8rem; list-style: none;">
  <li><b>Fewer notifications:</b> messages won't ping you unless it requires immediate attention</li>
  <li><b>Message summaries:</b> notifications are batched at regular times <i>and</i> before message deadlines</li>
  <li><b>Fixed contact:</b> left-side panes are arranged by you, not by who messaged you most recently</li>
</ul>

<script>
  //  new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

  import { user } from '../../store.js'
  import PhoneLogin from '../../PhoneLogin.svelte'
  import { doc, updateDoc } from "firebase/firestore";
  import { arrayUnion } from 'firebase/firestore'
  import db from "../../db.js"

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