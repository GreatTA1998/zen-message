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
  import { onSnapshot, doc, setDoc, getDoc } from 'firebase/firestore'
  import db from '../db.js'
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { hasFetchedUser, user, hasLogoExited, firstTimeUserFullName, invitedByUID, viewportHeight } from '../store.js'
  import { page } from '$app/stores';
  import { addFriend } from '/src/helpers.js'

  export let data  

  let { uid } = data
  let unsub

  onMount(() => {
    // UI resize logic (mainly because of iOS keyboard)
    // Viewport := the amount of available space to display web content, EXCLUDING keyboard
    function viewportHandler(event) {
      var viewport = event.target;
      console.log('viewport.height', viewport.height)
      viewportHeight.set(viewport.height)
    }

    window.visualViewport.addEventListener('scroll', viewportHandler);
    window.visualViewport.addEventListener('resize', viewportHandler);

    const auth = getAuth()
    onAuthStateChanged(auth, async (resultUser) => {
      console.log('resultUser =', resultUser)
      hasFetchedUser.set(true) 

      // logged in flow
      if (resultUser && resultUser.uid) {
        const userRef = doc(db, 'users', resultUser.uid)

        // has initial mirror doc in Firstore been created
        unsub = onSnapshot(userRef, async (snap) => {
          if (!snap.exists()) {
            const newName = $firstTimeUserFullName || 'John Apple'

            await setDoc(userRef, {
              uid: resultUser.uid, 
              name: newName,
              phoneNumber: resultUser.phoneNumber,
              friends: [],
              peopleCategories: ['Friends', 'Family'],
              friendUIDsWithNewMessages: []
            })

            if ($invitedByUID) {
              const inviterResult = await getDoc(
                doc(db, 'users', $invitedByUID)
              )
      
              const inviterDoc = inviterResult.data()
              addFriend({ 
                uid1: resultUser.uid, 
                uid2: inviterDoc.uid,
                name2: inviterDoc.name
              })
              addFriend({
                uid1: inviterDoc.uid,
                uid2: resultUser.uid, 
                name2: newName
              })
            }
            goto('/' + resultUser.uid)
          }
          else {
            user.set(snap.data())
          }
        })
        
        if ($page.url.pathname === '/') {
          goto('/' + resultUser.uid)
        }
      }

      // logged out workflow
      else {
        // goto('/')
      }
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