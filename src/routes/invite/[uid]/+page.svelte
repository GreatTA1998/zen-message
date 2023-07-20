<HomePageClone>
  <div style="display: flex; width: 100%; justify-content: center;">
    <input 
      placeholder="Your name e.g. Yordan Alvarez"
      style="font-size: 24px; width: 350px; height: 40px;"
      bind:value={firstTimeUserFullNameInput}
      on:input={(e) => firstTimeUserFullName.set(e.target.value)}
    >
  </div>
</HomePageClone>


<div style="color: white; padding-left: 10%; padding-right: 10%; padding-top: 4%; font-family: sans-serif; font-size: 1.2em;">
  <b style="color: red">Ping.</b> The neighbor got a new dog. <b style="color: red">Ping.</b> Somebody sent a holiday picture in Vancouver. <b style="color: red">Ping.</b> A buyer is asking for how much you're selling TV for. 
  <br> Too many notifications, too much context switching, too much information at the <b style="color: red">wrong place at the wrong time</b>, distracting our focus, adding stress to our mind. 
  Yet we can't just turn off all notifications for fear of missing really important messages...

  <br>
  <br>
  Here on zen-message.com, instead of lots of pings throughout the day, you get <b style="color: #79f2be;">one predictable summary notification at 5:10 pm every day</b>.
  Most messages are silent by default, <b style="color: #79f2be;">only time-sensitive messages will ping you</b>, so you can be focused, relaxed without the fear of missing important messages.

  <br>
  <br>
  Because your friend sent you an invite link, you'll automatically be added to each other's contact list after you log in. 
  Group chats are coming soon!
</div>

<div>

</div>

<div>Or create an account</div>
{#if !$user}
  <div style="width: 250px;">
    <PhoneLogin canTakeInternationalNumbers/> 
  </div>
{/if}

<script>
  import HomePageClone from '$lib/HomePageClone.svelte'

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
