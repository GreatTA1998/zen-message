{#if !hasLogoExited}
  <div 
    id="loading-screen-logo-start"
    style="opacity: 0; width: 30vw; height: 30vh"
    class="elementToFadeInAndOut center"
  >
    <img 
      src="/full-size-zen-bird.jpg" 
      class="app-loading-logo center"
      alt="logo"
    />
  </div>
{/if}
  <!-- hasLogoExited && $hasFetchedUser && !$user -->
{#if hasLogoExited && $hasFetchedUser && !$user}
  <div 
    class="quick-fade-in" 
    style="font-family: Roboto, sans-serif; margin-top: 20px;"
  >
    <h4 id="app-title">
      zen message
    </h4>

    <div style="margin: auto; width: 60%;">
      <ul style="font-size: 1.2rem; list-style: none;">
        <li>Minimize unnecessary notifications</li>
        <button>Normal</button>
      </ul>
    </div>
  </div>

  <div id="foo" class="ball" use:setupMovement></div>

  {#each Array(4) as _, i}
    <div class="message-bubble" style="width: {getRandomIntInclusive(40, 200)}px" use:autoMove>
    </div>
  {/each}

  <div>
    <div style="font-family: Roboto, sans-serif; color: grey; font-size: 1.2rem;">
      <div class="quick-fade-in" style="text-align: center">Re-arrange your contacts</div>
    </div>
  </div>

  <div style="margin-bottom: 500px;"></div>

  <div style="margin: auto;">
    <PhoneLogin 
      canTakeInternationalNumbers
    />
  </div>
{/if}

<script>
  import db from '../db.js'
  import { GoogleAuthProvider, getAuth, onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber, createUserWithEmailAndPassword } from "firebase/auth"	
  import { doc, collection, getDoc, getDocs, setDoc, updateDoc, arrayUnion, onSnapshot, arrayRemove } from "firebase/firestore"
  import ChatWindow from '../chatWindow.svelte'
  import { hasFetchedUser, user } from '../store.js'
  import { getRandomID } from '../helpers.js'
  import PhoneLogin from '../PhoneLogin.svelte'
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'

  let unsub

  let chatRoomID = ''
  let userRef = null
  let hasLogoExited = false

  onMount(() => {
    const Elem = document.getElementById('loading-screen-logo-start')
    Elem.addEventListener('animationend', (e) => {
      hasLogoExited = true
    })
  })

  function setupMovement (node) {
    document.addEventListener('click', (ev) => {
      node.style.transform = `translateY(${ev.clientY - 25}px)`;
      node.style.transform += `translateX(${ev.clientX - 25}px)`;
    }, false);
  }

  function autoMove (node) {
    node.style.width = `${getRandomIntInclusive(30, 300)}px;`
    console.log("node.style =", node.style)
    console.log("node.style.width =", node.style.width)
    node.style.transform = `translateX(${-400}px)`

    setTimeout(() => {
      node.style.transform = `translateX(${600}px)`
    }, getRandomIntInclusive(0, 9000))
  }

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }



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
      
      goto(`/${$user.uid}`)
    }
    console.log('fetched user')
    hasFetchedUser.set(true) 
  })
</script>

<style>
  li {
    margin-top: 10px;
  }

  .message-bubble {
    /* border: 2px solid red; */
    padding-top: 10px;
    padding-left: 18px;
    /* width: 200px; */
    height: 30px;
    border-radius: 30px;
    background-color: green;
    color: white;
  }

  /* phones */
  @media screen and (min-width: 320px) {
    #app-title {
      font-size: 3rem;
    }
    .app-loading-logo {
      width: 150px; 
      height: 150px;
      border-radius: 20px;
    }
  }

  @media screen and (min-width: 768px) {
    #app-title {
      font-size: 6rem;
    }
    .app-loading-logo {
      width: 250px;
      height: 250px;
      border-radius: 40px;
    }
  }


  #app-title {
    text-align: center; 
    font-weight: 500;
    margin-top: 30vh; 
    margin-bottom: 48px;
    letter-spacing: 0.01em;
    color: rgb(105,105,105);
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
    animation: fadein 0.4s ease-out 1 forwards; 
  }
  
  @keyframes fadein {
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

    /* safari iOS doesn't work without this */
    -webkit-transform: translate(-50%,-50%); 
  }

.elementToFadeInAndOut {
  animation: fadeInOut 1s ease-out 1 forwards;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.ball {
  border-radius: 25px;
  width: 50px;
  height: 50px;
  background: #c00;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 1s;
}

.message-bubble {
  margin-bottom: 20px;
  transition: transform 5s;
}
</style>

