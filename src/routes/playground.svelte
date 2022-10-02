<!-- <div> -->
  {#if !hasLogoExited}
    {#if !hasAnimationEnded}
      <div 
        id="loading-screen-logo-start"
        style="opacity: 0; width: 30vw; height: 30vh"
        class="fade-in center"
      >
        <!-- <p id="test">Hello Test animation</p> -->
        <!-- fade in and fade out -->
        <img 
          src="/full-size-zen-bird.jpg" alt="loading-logo-icon"
          width="250"
          height="250"
          style="border-radius: 40px;"
          class="center"
        />
      </div>
    {:else if hasAnimationEnded} 
      <div 
        id="loading-screen-logo-exit"
        use:action
        style="opacity: 0; width: 30vw; height: 30vh"
        class="fade-out"
      >
        <!-- <p id="test">Hello Test animation</p> -->
        <!-- fade in and fade out -->
        <img 
          src="/full-size-zen-bird.jpg" alt="loading-logo-icon"
          width="250"
          height="250"
          style="border-radius: 40px;"
          class="center"
        />
      </div>
    {/if}
  {/if}
    <!-- hasLogoExited && $hasFetchedUser && !$user -->
  {#if hasLogoExited && $hasFetchedUser && !$user}
    <div class="quick-fade-in" style="font-family: Roboto, sans-serif; color: grey; margin-top: 20px;">
      <h4 style="text-align: center; font-size: 5rem; margin-top: 30vh; margin-bottom: 48px">
          Zen Messenger
      </h4>
      <div style="margin: auto; width: 60%;">
        <ul style="font-size: 1.2rem; list-style: none;">
          <li><b>Fewer notifications:</b> messages won't ping you unless it requires immediate attention</li>
          <li><b>Message summaries:</b> notifications are batched at regular times <i>and</i> before message deadlines</li>
          <li><b>Fixed contact:</b> left-side panes are arranged by you, not by who messaged you most recently</li>
        </ul>
      </div>
    </div>

    <div style="margin-bottom: 60px;"></div>

    <div style="width: 350px; margin: auto;">
      <PhoneLogin 
        canTakeInternationalNumbers
      />
    </div>
  {/if}
<!-- </div> -->

<script>
  import db from '../db.js'
  import { GoogleAuthProvider, getAuth, onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber, createUserWithEmailAndPassword } from "firebase/auth"	
  import { doc, collection, getDoc, getDocs, setDoc, updateDoc, arrayUnion, onSnapshot, arrayRemove } from "firebase/firestore"
  import ChatWindow from '../chatWindow.svelte'
  import { hasFetchedUser, user } from '../store.js'
  import { getRandomID } from '../helpers.js'
  import PhoneLogin from '../PhoneLogin.svelte'
  import { onMount } from 'svelte'

  let unsub

  let chatRoomID = ''
  let userRef = null

  let currentMessageRequestContent = '' 
  let currentMessageRequestName = ''

  let newlyTypedCategory = ''

  let hasAnimationEnded = false
  let hasLogoExited = false

  onMount(() => {
    const Elem = document.getElementById('loading-screen-logo-start')
    Elem.addEventListener('animationend', (e) => {
      hasAnimationEnded = true
    })
  })

  function action (node) {
    node.addEventListener('animationend', e => {
       hasLogoExited = true
    })
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
          peopleCategories: ['Friends', 'Family'],
          friendUIDsWithNewMessages: []
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
      })
    }
    console.log('fetched user')
    hasFetchedUser.set(true) 
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
  .ul .li {
    margin-left: 4px;
  }

  .highlighted-box {
    background-color: orange;
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

  /* ease-in means slow start (so visible image stays longer) */
  .fade-out {
    animation: fadeout 0.8s ease-in 1 forwards;
  } 
  /* forwards: retains the last keyframe (so the image doesn't just appear again) 
    `1` is the number of repeats
  */

  @keyframes fadeout {
    from { opacity: 1; }
    to   { opacity: 0; }
  }

   /* Safari, Chrome and Opera > 12.1 */
  /* @-webkit-keyframes fadeout {
      from { opacity: 1; }
      to   { opacity: 0; }
  } */

  /* ease-out means slow end, so visible image stays longer */
  .fade-in {
    animation: fadein 0.8s ease-out 1 forwards;
  }

  .quick-fade-in {
    animation: fadein 0.2s ease-out 1 forwards; 
  }



  
  @keyframes fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
  }

  /* Firefox < 16 */
  @-moz-keyframes fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
  }

  /* Safari, Chrome and Opera > 12.1 */
  @-webkit-keyframes fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
  }

  /* Internet Explorer */
  @-ms-keyframes fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
  }

  /* Opera < 12.1 */
  @-o-keyframes fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
  }

  .center {
    position: absolute;
    top:0;
    bottom: 0;
    left: 0;
    right: 0;
    
    margin: auto;
  }
</style>
