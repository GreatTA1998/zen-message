<!-- TODO: put the logo transition here -->
{#if !$hasLogoExited}
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

<div class:invisible={!$hasLogoExited}>
  <slot>

  </slot>
</div>

<script>
  import { getAuth, onAuthStateChanged } from 'firebase/auth'
  import { onSnapshot, doc } from 'firebase/firestore'
  import db from '../db.js'
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { hasFetchedUser, user, hasLogoExited } from '../store.js'

  export let data  

  let { uid } = data
  let unsub

  onMount(() => {
    // TO-DO:  handle creating new user accounts
    // const initialUserDoc =  {
    //   uid: resultUser.uid,
    //   name: resultUser.displayName || 'John Apple',
    //   phoneNumber: resultUser.phoneNumber,
    //   friends: [],
    //   peopleCategories: ['Friends', 'Family'],
    //   friendUIDsWithNewMessages: []
    // }
    // await setDoc(doc(db, 'users', resultUser.uid), initialUserDoc)
    // // $user = initialUserDoc
    // user.set(initialUserDoc)

    const auth = getAuth()
    onAuthStateChanged(auth, async (resultUser) => {
      const routeUserID = uid 
      if (routeUserID) {
        if (!resultUser) goto('/')
        else if (resultUser.uid !== uid) goto('/')
      }
      else {
        if (resultUser) {
          if (resultUser.uid) { 
            goto('/' + resultUser.uid)
            unsub = onSnapshot(doc(db, 'users', uid), (snap) => {
              user.set(snap.data())
            })
          }
        }
      }
      hasFetchedUser.set(true) 
    })

    const Elem = document.getElementById('loading-screen-logo-start')
    Elem.addEventListener('animationend', (e) => {
      hasLogoExited.set(true)
    })
  })
</script>

<style>
  .invisible {
    display: none; 
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

  @media screen and (min-width: 320px) {
    .app-loading-logo {
      width: 110px; 
      height: 110px;
      border-radius: 18px;
    }
  }

  @media screen and (min-width: 768px) {
    .app-loading-logo {
      width: 250px;
      height: 250px;
      border-radius: 40px;
    }
  }
</style>