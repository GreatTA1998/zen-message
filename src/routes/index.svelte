<div style="display: flex; padding-left: 0px; padding-right: 0px;">
  <div>
    {#if !$user}
        <div style="font-family: Roboto, sans-serif; font-size: 1.5rem; color: grey; margin-top: 20px;">
          <b>What problem does this solve:</b>
          Everytime someone messages us, we get a notification IMMEDIATELY, regardless of whether the message is time-sensitive, or even important. 
          Even if you try to ignore it, visually they go to the top of our chat list; 
          if you visited Messenger for a specific purpose, the top message distractions will help you forget what you were doing.
          <br><br>
          <b>How this app differs</b>
          <ol>
            <li>
            Messages have no notifications by default unless the other person specifies it's time-sensitive e.g. "Before today" / "This week"
            </li>
            <li>
            Left-side is organized intentionally - NOT by whoever messaged you most recently
            </li>
          </ol>
        </div>
        
        <PhoneLogin 
          canTakeInternationalNumbers
        />
    {:else}
      <div style="width: 100px;">
        <div on:drop={(e) => drop_handler(e)} on:dragover={dragover_handler}>
          <h2 class="message-group-title">
            People
          </h2>
          {#each $user.friends as friend}
            <div 
              on:click={() => currentFriendUID = friend.uid} 
              draggable="true" 
              on:dragstart={(e) => dragstart_handler(e)}
              style="border: solid orange; height: 40px; display: flex; align-items: center;"
              class:highlighted-box={friend.uid === currentFriendUID}
              class:highlighted-blue={friendUIDsWithNewMessages.includes(friend.uid)}
            >
              <span style="margin-left: 5px">
                {friend.name}
              </span>
            </div>
          {/each}
        </div>

        <button style="margin-top: 20px;" on:click={() => isAddingFriend = !isAddingFriend}>
          Add person
        </button>

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

        <!-- LIST CATEGORIES -->
        {#if $user.peopleCategories instanceof Array}
          {#each $user.peopleCategories as category}
            <h2 class="message-group-title">{category}</h2>
          {/each}
        {/if}

        <h2 class="message-group-title" style="margin-top: 50px;">
          Editable category
        </h2>
        <button on:click={createNewCategory}>New category</button>
        <input bind:value={newlyTypedCategory} style="width: 90px">


        <h2 class="message-group-title" style="margin-top: 50px;">
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
        {/if}
      </div>
    {/if}
  </div>

  <div style="width: 320px; margin-left: 5px; margin-top: 5px;">
    {#if currentFriendUID && $user && chatRoomID}
      {#key currentFriendUID}
        <ChatWindow 
          {chatRoomID}
          friendUID={currentFriendUID} 
          otherPersonUID={currentFriendUID}
          currentUser={$user}
        />
      {/key}
    {:else if currentMessageRequestName}
      <div>
        {currentMessageRequestContent}
      </div>

      <button on:click={() => resolveMessageRequest(currentMessageRequestName)}>
        Resolve and delete
      </button>

    {:else if $user}
      <div style="margin-top: 5px; margin-bottom: 12px;">
        Click any chat on the left-side
      </div> 

      <input placeholder="John Apple" bind:value={newUserName}>

      <button on:click={updateUserName}>
        Update name
      </button>

      <div style="margin-top: 10px;">
        Give this link to your friends & family so they can message you without a zen-message account:
      </div>

      <a style="font-size: 0.8rem; color: blue" href="https://zen-message.com/{$user.uid}" target="_blank">
        zen-message.com/{$user.uid}
      </a>
    {/if}
  </div>
</div>

<script>
  let newUserName = ''

  const chatID = ''
  const allFriends = [] 
  const allFamily = [] 
  const everyoneElse = [] 

  import db from '../db.js'
  import { GoogleAuthProvider, getAuth, onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber, createUserWithEmailAndPassword } from "firebase/auth"	
  import { doc, collection, getDoc, getDocs, setDoc, updateDoc, arrayUnion, onSnapshot, arrayRemove } from "firebase/firestore"
  import ChatWindow from '../chatWindow.svelte'
  import { user } from '../store.js'
  import { getRandomID } from '../helpers.js'
  import PhoneLogin from '../PhoneLogin.svelte'

  let unsub

  let chatRoomID = ''
  let userRef = null

  let currentMessageRequestContent = '' 
  let currentMessageRequestName = ''

  let newlyTypedCategory = ''

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
      friends: arrayUnion({ name, uid })
    })

    const chatRoomID = $user.uid < uid ? ($user.uid + uid) : (uid + $user.uid)
    const chatRef = doc(db, 'chats', chatRoomID)
    await setDoc(chatRef, {
      participantUIDs: [uid, $user.uid],
      messages: []
    })
    isAddingFriend = false
  }

  onAuthStateChanged(auth, async (resultUser) => {
    if (resultUser) {
      const docRef = doc(db, "users", resultUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        user.set(docSnap.data())
        // $user = docSnap.data()
      } else {
        const initialUserDoc =  {
          uid: resultUser.uid,
          name: resultUser.displayName || 'John Apple',
          phoneNumber: resultUser.phoneNumber,
          friends: [],
          family: [],
          VIPs: [],
          everyoneElse: []
        }
        await setDoc(doc(db, 'users', resultUser.uid), initialUserDoc)
        // $user = initialUserDoc
        user.set(initialUserDoc)
      }

      unsub = onSnapshot(doc(db, 'users', resultUser.uid), (snap) => {
        user.set(snap.data())
        if ($user.friendUIDsWithNewMessages) {
          friendUIDsWithNewMessages = $user.friendUIDsWithNewMessages
        }
      });
    } 
  })
  
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

  function drop_handler (e) {
    console.log('detected drop =', e)
    // check with person it is
    // have the friend somehow point to the category i.e. friend.category = ''
    // consider using IDs
  }

  function dragover_handler (e) {
    console.log("detected dragover =", e)
  }

  function dragstart_handler (e) {
    console.log('dragstart =', e)
  }
</script>

<style>
  .highlighted-box {
    background-color: orange;
  }

  .highlighted-blue {
    background-color: lightseagreen;
  }

  span:hover {
    background-color: cyan;
  }

  .message-group-title {
    font-family: Roboto, sans-serif; 
    font-weight: 600; 
    color: rgb(119, 110, 110);
    margin-top: 5px;
    margin-bottom: 5px;
  }
</style>
