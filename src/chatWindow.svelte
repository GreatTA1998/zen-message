<div style="width: {chatWindowWidth}px;">
  <div bind:this={div} id="chat-window" style="height: {$viewportHeight - 74}px; max-height: 316px; overflow-y: auto; overflow-x: hidden;">
    {#if chatDoc.messages}
      {#each chatDoc.messages as message, i}
        <div style="
          display: flex; 
          width: 280px; 
          margin-right: 20px; 

          color: white;
          font-family: sans-serif;"
        >
          {#if message.authorUID === currentUser.uid}
            <p style="font-size: 1em; margin-left: auto; margin-right: 0; margin-bottom: 4px">
              {message.content} 
            </p>
            <p style="font-size: 0.8em; color: grey; margin-left: 4px; margin-bottom: 0px; margin-top: 18px">
              {' ' + displayDate(message.timestamp)}
            </p>
          {:else}
            <p style="font-size: 1em; margin-right: 4px; margin-left: 0; margin-bottom: 4px">
              {message.content}
            </p>
            <p style="font-size: 0.8em; color: grey; margin-left: 0; margin-right: auto; margin-top: 18px">
              {' ' + displayDate(message.timestamp)}
            </p>
          {/if}

          {#if i === chatDoc.messages.length - 1}
            <div bind:this={AutoscrollTargetElem}></div>
          {/if}
        </div>
      {/each}
    {/if}
  </div>

  <!-- border-box needed otherwise 410px <input> isn't equivalent to 410px on <button> -->
  <div class="my-font" style="display: flex; align-items: center; width: 220px; margin-top: 3%; margin-bottom: 1%;">
    <!-- change this to toggle -->
    <input type="checkbox" bind:checked={willSendNotif} style="transform: scale(1.4); margin-right: 4px;">
    {#if replyWithin === replyTimingOptionsEnum.ANY_TIME}
      <div style="font-size: 0.8em; font-weight: 600; color: darkgrey">
        Send notification immediately
      </div>
    {:else if replyWithin === replyTimingOptionsEnum.NOW}
      <div style="font-size: 0.8em; font-weight: 600; color: #498bf5">
        Send notification immediately
      </div>
    {/if}

    <!-- <div>debugLog: {debugLog}</div> -->

  </div>

  <!-- <form> element automatically handles ENTER KEY as a submit event -->
  <form on:submit|preventDefault={() => sendMessage()}>
    <div class="my-flexbox">
      <input 
        class="my-message-input" 
        placeholder="Message..." 
        type="text"
        bind:value={newMessage}
        bind:this={MessageField}
      >
      <div 
        on:click={sendMessage}
        style="color: { newMessage.length > 0 ? 'white' : 'grey'}; font-family: sans-serif; font-size: 1em; font-weight: 600; margin-left: 4px;"
      >
        Send
      </div>
    </div>
  </form>

  <!-- <div style="display: flex; margin-top: 5px; align-items: center; flex-wrap: nowrap">
    <div style="color: grey;">Want reply:</div> 
    {#each replyTimingOptions as replyTimingOption}
      <div on:click={() => replyWithin = replyTimingOption} 
        class:highlighted-box={replyWithin === replyTimingOption} 
        class="clickable-option" 
        style="margin-left: 4px; color: white;">
        {replyTimingOption}
      </div>
    {/each}
  </div> -->
</div>

<script>
  import { where, getDoc, getDocs, query, collection, doc, updateDoc, arrayUnion, onSnapshot, arrayRemove } from 'firebase/firestore'
  import db from './db';
  import { onMount } from 'svelte'
  import { displayDate } from './helpers.js'

  import { getFunctions, httpsCallable } from "firebase/functions"
  import { updateCurrentUser } from 'firebase/auth'
  import { tick } from 'svelte'
  import { viewportHeight } from '/src/store.js'
  import { page } from '$app/stores'
  import { beforeUpdate, afterUpdate } from 'svelte';
  import { browser } from '$app/environment'

  export let friendUID
  export let chatRoomID
  export let currentUser
  export let chatWindowWidth 
  
  let debugLog

  let div;
	let autoscroll;

  // whenever state changes the DOM, scroll automatically (I think, not sure)
  // https://svelte.dev/tutorial/update
	beforeUpdate(() => {
		autoscroll = div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
	});

	afterUpdate(() => {
		if (autoscroll) div.scrollTo(0, div.scrollHeight);
	})

  const functions = getFunctions()
  const sendTextMessage = httpsCallable(functions, 'sendTextMessage');

  let MessageField
  let AutoscrollTargetElem
  let chatID
  let newMessage = ''

  const replyTimingOptionsEnum = {
    NOW: 'now',
    TODAY: 'today',
    ANY_TIME: 'any time'
  }

  let willSendNotif
  $: {
    if (willSendNotif) {
      replyWithin =  replyTimingOptionsEnum.NOW
    } 
    else {
      replyWithin = replyTimingOptionsEnum.ANY_TIME
    }
  }

  let replyTimingOptions = ['now', 'today', 'any time']
  let replyWithin = 'any time'
  let unsub
  let chatDoc = { messages: [] }
  let isInitialFetch = true


  onMount(() => {
    // UNDERSTAND THIS BEFORE DEBUGGING: THE ANIMATION WILL REVEAL INSIGHTS
    // THE SCROLLING CAN'T BE PREVENTED WITH CSS BECAUSE SAFARI LITERALLY ADDS A NEW ELEMENT OUTSIDE OF <html>
    // Why iOS does this: https://stackoverflow.com/a/66393991/7812829
    //    just don't allow scrolling in the first place
    //    document.body.style.overflowY = 'hidden'
    // But that won't work. See above for detailed explanation.

    // Prevents Safari keyboard from pushing content offscreen (it does so by shoving <html> upwards)
    // solutions from: https://stackoverflow.com/questions/38619762/how-to-prevent-ios-keyboard-from-pushing-the-view-off-screen-with-css-or-js
    if (browser) {

      
      // both 'scroll' and 'resize' event are fired, but
      // 'scroll' happens later, which is safer as a timing mechanism
      // THIS IS A NULLIFIER DESIGN: you continuously "dispel"/reset the page positioning while iOS is scrolling it
      window.visualViewport.addEventListener('scroll', () => {
        const intervalID = setInterval(resetPositionOfPage, 1)
        setTimeout(() => {
          clearInterval(intervalID)
        }, 1000)
        // resetPositionOfPage()
      })
      window.visualViewport.addEventListener('resize', () => resetPositionOfPage())

      MessageField.onfocus = function () {
        resetPositionOfPage()
      }

      // not sure if necessary but keep just in-case for now
      document.ontouchmove = function(e){
        e.preventDefault();
      }

      function resetPositionOfPage () {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
      }
    }

    unsub = onSnapshot(doc(db, 'chats', chatRoomID), async (snap) => {
      if (snap.data()) {
        chatDoc = snap.data()

        // mark chat as read
        if (isInitialFetch) {
          isInitialFetch = false
          const myRef = doc(db, 'users', currentUser.uid)
          updateDoc(myRef, {
            friendUIDsWithNewMessages: arrayRemove(friendUID)
          })

          await tick() // let message divs render

          // DELAY WON'T WORK FOR IOS, IT'S A FEATURE NOT A BUG OF THE PLATFORM TO NOT ALLOW AUTOFOCUS
          // focusAndOpenKeyboard(MessageField, 300)
        }
      }
    })
  })

  // hack from to combat iOS safari: https://stackoverflow.com/a/55425845/7812829
  function focusAndOpenKeyboard(el, timeout) {
    if(!timeout) {
      timeout = 100;
    }
    if(el) {
      // Align temp input element approximately where the input element is
      // so the cursor doesn't jump around
      var __tempEl__ = document.createElement('input');
      __tempEl__.style.position = 'absolute';
      __tempEl__.style.top = (el.offsetTop + 7) + 'px';
      __tempEl__.style.left = el.offsetLeft + 'px';
      __tempEl__.style.height = 0;
      __tempEl__.style.opacity = 0;
      // Put this temp element as a child of the page <body> and focus on it
      document.body.appendChild(__tempEl__);
      __tempEl__.focus();

      // The keyboard is open. Now do a delayed focus on the target element
      setTimeout(function() {
        el.focus();
        el.click();
        // Remove the temp element
        document.body.removeChild(__tempEl__);
      }, timeout);
    }
  }

  async function sendMessage () {
    if (newMessage.length === 0) return
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
    
    const otherRef = doc(db, 'users', friendUID)
    updateDoc(otherRef, {
      friendUIDsWithNewMessages: arrayUnion(currentUser.uid)
    })  

    // get the other person's phone number
    const otherPersonSnap = await getDoc(otherRef)
    const otherPersonDoc = otherPersonSnap.data()

    // HANDLE SMS NOTIFICATION
    switch (replyWithin) {
      case 'any time': 
        break
      case 'now': 
        console.log('sending text to ,', otherPersonDoc.phoneNumber)
        sendTextMessage({ 
          content: `${currentUser.name} wrote: "${newMessage}". ${$page.url.origin}/${otherPersonDoc.uid}`,
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
  /* Copying Notion scrollbar */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: #949191;
  }

  ::-webkit-scrollbar-track {
    background: #EDECE9;
  }


  .my-message-input {
    width: 280px; 
    height: 28px;
    box-sizing: border-box;
    background: #3e3f40;
    color: white;

    border-radius: 16px;
    padding-left: 6px;
    padding-bottom: 1px;


    /* text styles */
    font-size: 1em;

    /* resetting User Agent Stylesheet default values */
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    
    border: 1px solid;
    box-shadow: none;
  }

  input[type="text"], textarea {
    background-color : #3e3f40; 
  }

  ::placeholder {
    color: #a7abb0;
    font-size: 1em;
  }

  .my-font {
    color: white;
    font-family: sans-serif; 
  }

  .my-flexbox {
    display: flex; 
    align-items: center;
    justify-content: center;
  }
  
 ::-webkit-scrollbar {
    /* width: em;
    height: 2em */
}

/*
  ::-webkit-scrollbar-button {
      background: #ccc
  }
  ::-webkit-scrollbar-track-piece {
      background: #888
  }
  ::-webkit-scrollbar-thumb {
      background: #eee
  }​ */

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
