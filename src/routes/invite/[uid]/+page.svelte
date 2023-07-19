<h1 style="color: white;">
  Invite with UID: { uid }
</h1>

<div style="color: white;">
  Your focus and peace of mind is important,
  you don't want to get pinged all the time, getting distracted 
  by messages at the wrong place at the wrong time. 

  <br>
  Here on zen-message.com, most messages are silent by default,
  and you will be sent one summary every day at 5 pm. 

  You won't miss important messages, because your friends <b>can</b>
  notify you on the messages that requires a fast reply.
</div>

<div>
<input 
  placeholder="Name e.g. Yordan Alvarez"
  bind:value={firstTimeUserFullNameInput}
  on:input={(e) => firstTimeUserFullName.set(e.target.value)}
>
</div>

<div>Or create an account</div>
{#if !$user}
  <div style="width: 250px;">
    <PhoneLogin canTakeInternationalNumbers/> 
  </div>
{/if}

<script>
  // How to achieve:
  //   INITIALIZE FULL NAME
  //        - phone login
  //        - 
  //
  //   ADD FRIENDS AUTOMATICALLY: 
  //        - easy, just copy the function and call it for both people 

  //  new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

  import { user, firstTimeUserFullName, invitedByUID } from '/src/store.js'
  import PhoneLogin from '/src/PhoneLogin.svelte'
  import { doc, updateDoc } from "firebase/firestore";
  import { arrayUnion } from 'firebase/firestore'
  import db from "/src/db.js"
  
  export let data  

  let { uid } = data

  let newMessage = ''
  let senderName = ''
  let MessageField

  let firstTimeUserFullNameInput = ''

  $: console.log("$firstTimeUserFullName =", $firstTimeUserFullName)

  console.log('uid =', uid)
  invitedByUID.set(uid) // automatically add each other as friends using this information
</script>
