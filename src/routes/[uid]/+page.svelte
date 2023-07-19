{#if $hasFetchedUser && $user && $hasLogoExited && $user.uid === uid}
  <div class="quick-fade-in" style="display: flex;">
    <div style="width: 150px; height: 400px; overflow-y: auto;">
      <!-- LIST CATEGORIES -->
      <!-- For v0, everyone is "family" technically -->
      <div on:click={() => currentFriendUID = ''} style="color: white;" 
        class="left-drawer-item"
        class:highlighted-box={currentFriendUID === ''}
      >
        <SettingsAvatar/>
        <span class="left-drawer-item-text">
          Settings
        </span>
      </div>

      {#if $user.peopleCategories instanceof Array}
        {#each $user.peopleCategories as category}
          <div on:drop={(e) => drop_handler(e, category)} on:dragover={dragover_handler} 
            style="
              background-color: black;
            "
          >

            <!-- <h2 class="message-group-title">
              {category}
            </h2> -->
            {#each $user.friends.filter(f => f.category === category) as friend}
              <div 
                on:click={() => currentFriendUID = friend.uid} 
                on:dragstart={(e) => dragstart_handler(e, friend.uid)}
                draggable="true" 

                class="left-drawer-item"
                class:highlighted-box={currentFriendUID === friend.uid}
                class:highlighted-blue={friendUIDsWithNewMessages.includes(friend.uid)}
              >
                <PersonAvatar/>

                <span class="left-drawer-item-text">
                  {friend.name}
                </span>
              </div>
            {/each}
          </div>
        {/each}
      {/if}


      <div on:click={() => currentFriendUID = 'add-person'} style="color: white;" 
        class="left-drawer-item"
        class:highlighted-box={currentFriendUID === 'add-person'}
      >
        <PlusSignAvatar/>
        <span class="left-drawer-item-text">
          Add chat
        </span>
      </div>

        <!-- FOR FUTURE, EDITABLE CATEGORY
          <h2 class="message-group-title" style="margin-top: 50px;">
            Editable category
          </h2>
          <button on:click={createNewCategory}>New category</button>
          <input bind:value={newlyTypedCategory} style="width: 90px"> 
        -->

        <!-- ADD NEW PERSON -->
        <!-- <button style="margin-top: 20px;" on:click={() => isAddingFriend = !isAddingFriend}>
          Add person
        </button> -->

        {#if isAddingFriend}
          <div>Here are all accounts:</div>
          {#each accounts as account} 
            {#if account.uid !== $user.uid}
              <div style="margin-top: 10px;">
                <button on:click={() => addFriend(account)} style="margin-left: 20px;">
                  {account.name}
                </button>
              </div>
            {/if}
          {/each}
        {/if}


        <!-- <h2 class="message-group-title" style="margin-top: 50px;">
          Outside Messages
        </h2>
        
        {#if $user.messageRequestNames instanceof Array}
          {#each $user.messageRequestNames as newName}
            <div 
              on:click={() => showMessageRequest(newName)}
              style="border: solid blue; height: 40px; display: flex; align-items: center;"
            >
              {newName}
            </div>
          {/each}
        {/if} -->
      </div>

      <div style="width: 320px; margin-left: 5px; margin-top: 5px;">
        {#if currentFriendUID && currentFriendUID !== 'add-person' && $user && chatRoomID}
          {#key currentFriendUID}
            <div class="quick-fade-in">
              <ChatWindow 
                {chatRoomID}
                friendUID={currentFriendUID} 
                otherPersonUID={currentFriendUID}
                currentUser={$user}
              />
            </div>
          {/key}
        {:else if currentMessageRequestName}
          <div>
            {currentMessageRequestContent}
          </div>

          <button on:click={() => resolveMessageRequest(currentMessageRequestName)}>
            Resolve and delete
          </button>
        {:else if currentFriendUID === 'add-person'}
          <div style="color: white;">
            Invite URL:
          </div>

          <div style="color: white;">
            Create group chat
          </div>

          <input placeholder="Search EXACT name">
        {:else if $user}
          <div style="display: flex; align-items: center;">
            <input type="checkbox">
            <div>
              <div style="color: white; font-family: sans-serif; font-size: 1rem; font-weight: 600;">
                Receive daily summary
              </div>

              <div style="color: white; font-family: sans-serif; font-size: 0.8em;">
                Sent to you everyday at 5 pm <i>(future update: set custom schedules e.g. Mon-Fri 7 pm, Sat-Sun 1 pm)</i>
              </div>
            </div>
          </div>

          <div style="margin-top: 2%"></div>

          <!-- HANGOUT MODE FOR FUTURE -->
          <!-- <div style="display: flex; align-items: center;">
            <input type="checkbox">
            <div>
              <div style="color: white; font-family: sans-serif; font-size: 0.4em; font-weight: 600;">
                Hangout mode
              </div>
              <div style="color: white; font-family: sans-serif; font-size: 0.3em;">
                Temporarily get notified for all messages
                <i>(future update: auto-expires after 30 minutes of inactivity)</i>
              </div>
            </div>
          </div> -->


        <!-- <input placeholder="John Apple" bind:value={newUserName}> -->

        <!-- <button on:click={updateUserName}>
          Update name
        </button> -->
      {/if}
    </div>
  </div>
{/if}

<script>

let newUserName = ''

const chatID = ''
const allFriends = [] 
const allFamily = [] 
const everyoneElse = [] 

import db from '../../db.js'
import { getAuth, onAuthStateChanged } from "firebase/auth"	
import { doc, collection, getDoc, getDocs, setDoc, updateDoc, arrayUnion, onSnapshot, arrayRemove } from "firebase/firestore"
import ChatWindow from '../../chatWindow.svelte'
import { hasFetchedUser, user, hasLogoExited } from '../../store.js'
import { getRandomID } from '../../helpers.js'
import { onMount } from 'svelte'
import { goto } from '$app/navigation';
import PersonAvatar from '$lib/PersonAvatar.svelte'
import SettingsAvatar from '$lib/SettingsAvatar.svelte'
import PlusSignAvatar from '$lib/PlusSignAvatar.svelte'

export let data 
let { uid } = data

let unsub

let chatRoomID = ''
let userRef = null

let currentMessageRequestContent = '' 
let currentMessageRequestName = ''

let newlyTypedCategory = ''

$: if ($user) {
  if ($user.friendUIDsWithNewMessages) {
    friendUIDsWithNewMessages = $user.friendUIDsWithNewMessages
  }
}

$: if (currentFriendUID) {
  chatRoomID = $user.uid < currentFriendUID ? ($user.uid + currentFriendUID) : (currentFriendUID + $user.uid)
  console.log('chatRoomID =', chatRoomID)
}

$: if ($user) {
  userRef = doc(db, 'users', $user.uid)
}

let friendUIDsWithNewMessages = [] 

const auth = getAuth();

let currentFriendUID = ''
let accounts = []
let isAddingFriend = false 

const docsRef = collection(db, 'users')
getDocs(docsRef).then(snap => {
  snap.docs.forEach(doc => {
    accounts.push({ uid: doc.id, ...doc.data() })
  })
})

async function addFriend ({ name, uid }) {
  for (const friend of $user.friends) {
    if (friend.uid === uid) {
      alert("You're already friends")
      isAddingFriend = false
      return 
    }
  }

  const ref = doc(db, 'users', $user.uid)
  await updateDoc(ref, {
    friends: arrayUnion({ name, uid, category: $user.peopleCategories[0] })
  })

  const chatRoomID = $user.uid < uid ? ($user.uid + uid) : (uid + $user.uid)
  const chatRef = doc(db, 'chats', chatRoomID)
  await setDoc(chatRef, {
    participantUIDs: [uid, $user.uid],
    messages: []
  })
  isAddingFriend = false
}

async function updateUserName () {
  const ref = 
  await updateDoc(doc(db, 'users', $user.uid), {
    name: newUserName
  })
  newUserName = ''
  alert('successfully updated')
}

function showMessageRequest (name) {
  currentFriendUID = '' 
  currentMessageRequestName = name
  currentMessageRequestContent = $user.messageRequestObjects.filter(obj => obj.senderName === name)[0].content
}

function resolveMessageRequest (name) {
  // const userRef = doc(db, 'users', $user.uid)
  // const target = $user.messageRequestObjects.filter(obj => obj.senderName === name)[0]
  updateDoc(userRef, {
    messageRequestObjects: arrayRemove({
      content: currentMessageRequestContent,
      senderName: currentMessageRequestName
    }),
    messageRequestNames: arrayRemove(currentMessageRequestName)
  })

  currentMessageRequestName = '' 
  currentMessageRequestContent = ''
}

function createNewCategory () {
  if (!newlyTypedCategory) {
    alert("New category can't be blank")
  }
  updateDoc(userRef, { 
    peopleCategories: arrayUnion(newlyTypedCategory) 
  })
  console.log("created new category")
  newlyTypedCategory = ''
}

async function drop_handler (e, categoryName) {
  e.preventDefault()
  const friendUID = e.dataTransfer.getData('text/plain')
  
  // update the user object
  const copy = [...$user.friends]
  for (const friend of copy) {
    if (friend.uid === friendUID) {
      friend.category = categoryName
      break
    }
  }

  await updateDoc(userRef, {
    friends: copy
  })
}

function dragover_handler (e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move"
}

function dragstart_handler (e, friendUID) {
  e.dataTransfer.setData("text/plain", friendUID)
}
</script>

<style>
.left-drawer-item {
  border-radius: 1px; 
  height: 56px; 
  display: flex; 
  align-items: center;
  padding-left: 4px;
}

.left-drawer-item-text {
  margin-left: 5px; font-family: Roboto, sans-serif; color: white; font-size: 1em;
}


.ul .li {
  margin-left: 4px;
}

.highlighted-box {
  background-color: #2b2928; 
  /* background-color: orange; */
}

.highlighted-blue {
  background-color: lightseagreen;
}
/* 
span:hover {
  background-color: cyan;
} */

.message-group-title {
  font-family: Roboto, sans-serif; 
  font-weight: 600; 
  color: rgb(119, 110, 110);
  margin-top: 5px;
  margin-bottom: 5px;
}

.quick-fade-in {
    animation: fadein 0.4s ease-out 1 forwards; 
  }
  
  @keyframes fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
  }
</style>