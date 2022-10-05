{#if !hasLogoExited}
  <div 
    id="loading-screen-logo-start"
    style="opacity: 0; width: 30vw; height: 30vh"
    class="elementToFadeInAndOut center"
  >
    <img 
      src="/largest-zen-bird.jpg" 
      class="app-loading-logo center"
      alt="logo"
    />
  </div>
{/if}

{#if hasLogoExited && $hasFetchedUser && !$user}
  <div 
    class="quick-fade-in" 
    style="font-family: Roboto, sans-serif; margin-top: 20px;"
  >
    <h4 id="app-title">
      zen message
    </h4>

    <div style="font-family: Roboto, sans-serif; color: grey; font-size: 1.2rem;">
      <div class="quick-fade-in" style="text-align: center; margin-bottom: 40px; color: rgb(105,105,105);">
        Fewer notifications
      </div>
    </div> 
  </div>

  {#if !isShowingPhoneLogin}
  <div class="fade-out" id="demo-messages-wrapper" use:setupEndListener>
    {#each Array(3) as _, i}
      <div class="message-bubble" style="width: {getRandomIntInclusive(40, 200)}px" use:autoMove>
      </div>
    {/each}
  </div>
  {:else}
    <div style="margin: auto;" class="fade-in">
      <PhoneLogin 
        canTakeInternationalNumbers
      />
    </div>
  {/if}

  <!-- BALL THAT MOVES TO xy COORDINATES -->
  <!-- <div id="foo" class="ball" use:setupMovement></div> -->

  <!-- <div style="font-family: Roboto, sans-serif; color: grey; font-size: 1.2rem;">
    <div class="quick-fade-in" style="text-align: center">Re-arrange your contacts</div>
  </div> -->
{/if}

<script>
  import db from '../db.js'
  import { GoogleAuthProvider, getAuth, onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber, createUserWithEmailAndPassword } from "firebase/auth"	
  import { doc, collection, getDoc, getDocs, setDoc, updateDoc, arrayUnion, onSnapshot, arrayRemove } from "firebase/firestore"
  import { hasFetchedUser, user } from '../store.js'
  import { getRandomID } from '../helpers.js'
  import PhoneLogin from '../PhoneLogin.svelte'
  import { onMount, tick } from 'svelte'
  import { goto } from '$app/navigation'

  let unsub

  let userRef = null
  let hasLogoExited = false
  let isShowingPhoneLogin = false 

  onMount(() => {
    const Elem = document.getElementById('loading-screen-logo-start')
    Elem.addEventListener('animationend', (e) => {
      hasLogoExited = true
    })
  })

  function setupEndListener (node) {
    const epsilon = 800
    setTimeout(() => {
      isShowingPhoneLogin = true
    }, 2000 + 3001 + epsilon) 
  }

  function setupMovement (node) {
    document.addEventListener('click', (ev) => {
      node.style.transform = `translateY(${ev.clientY - 25}px)`;
      node.style.transform += `translateX(${ev.clientX - 25}px)`;
    }, false);
  }

  async function autoMove (node) {
    let deviceWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (deviceWidth < 480) {
      node.style.background = `hsl(118, 70%, ${getRandomIntInclusive(25, 75)}%)` // `hsl(118, 70%, ${getRandomIntInclusive(40, 60)}%)}`  // random shade of green
      node.style.width = '40px'
      node.style.transform = `translateX(${-200}px)`
      await tick()
      await tick()
      setTimeout(() => {
        node.style.transform = `translateX(${150}px)`
        node.style.transition = 'transform 2s ease-out'
      }, getRandomIntInclusive(0, 3001))
    } else {
      node.style.width = '300px'
      node.style.transform = `translateX(${-400}px)`

      setTimeout(() => {
        node.style.transform = `translateX(${600}px)`
        node.style.transition = 'transform 2s ease-out'
      }, getRandomIntInclusive(0, 3001))
    }


    node.style.transition = 'opacity 3s ease-in'
  }

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min) // The maximum is inclusive and the minimum is inclusive
  }

  function action (node) {
    node.addEventListener('animationend', e => {
       hasLogoExited = true
    })
  } 

  $: if ($user) {
    userRef = doc(db, 'users', $user.uid)
  }

  let friendUIDsWithNewMessages = [] 
  
  const auth = getAuth();
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
    padding-top: 10px;
    padding-left: 18px;
    border-radius: 30px;
    /* background-color: green; */
    /* color: white; */
  }

  /* phones */
  @media screen and (min-width: 320px) {
    #app-title {
      font-size: 2.6rem;
    }
    .app-loading-logo {
      width: 110px; 
      height: 110px;
      border-radius: 18px;
    }
    .message-bubble {
      height: 15px;
      margin-bottom: 10px;
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
    .message-bubble {
      height: 30px;
      margin-bottom: 20px;
    }
  }

  #app-title {
    text-align: center; 
    font-weight: 500;
    margin-top: 30vh; 
    margin-bottom: 24px;
    letter-spacing: 0.01em;
    color: rgb(105,105,105);
  }

  /* ease-in means slow start (so visible image stays longer) */
  .fade-out {
    animation: fadeout 7s ease-in 1 forwards;
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

  /* From Prabhakar's centering solution that works for iOS unlike StackOverflow
  https://github.com/project-feynman/v3/blob/d864f54d9a69e6cdf0beb7818e8b07a85cebb7eb/src/components/SeeExplanation.vue */
  .center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%)
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
</style>

