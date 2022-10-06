<!-- TO-DO: people need to *actually understand* how notification throttling works
  immediately from looking at the home page
-->
{#if $hasFetchedUser && !$user && $hasLogoExited}
  <div 
    class="quick-fade-in" 
    style="margin-top: 20px;"
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
    <div style="margin: auto;" class="quick-fade-in">
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
  import { hasFetchedUser, user, hasLogoExited } from '../store.js'
  import { getRandomID } from '../helpers.js'
  import PhoneLogin from '../PhoneLogin.svelte'
  import { onMount, tick } from 'svelte'
  import { goto } from '$app/navigation'

  let isShowingPhoneLogin = false 

  function setupEndListener (node) {
    const epsilon = 100
    const fadeOutDuration = 3000
    setTimeout(() => {
      isShowingPhoneLogin = true
    }, fadeOutDuration + epsilon) 
  }

  function setupMovement (node) {
    document.addEventListener('click', (ev) => {
      node.style.transform = `translateY(${ev.clientY - 25}px)`;
      node.style.transform += `translateX(${ev.clientX - 25}px)`;
    }, false);
  }

  async function autoMove (node) {
    let deviceWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    node.style.background = `hsl(118, 70%, ${getRandomIntInclusive(25, 75)}%)`
    if (deviceWidth < 480) { // `hsl(118, 70%, ${getRandomIntInclusive(40, 60)}%)}`  // random shade of green
      node.style.width = '40px'
      node.style.transform = `translateX(${-200}px)`
      await tick()
      await tick()
      setTimeout(() => {
        node.style.transform = `translateX(${200}px)`
        node.style.transition = 'transform 2s'
      }, getRandomIntInclusive(0, 1001))
    } else {
      node.style.width = '300px'
      node.style.transform = `translateX(${-400}px)`

      setTimeout(() => {
        node.style.transform = `translateX(${600}px)`
        node.style.transition = 'transform 2s'
      }, getRandomIntInclusive(0, 1001))
    }


    node.style.transition = 'opacity 3s ease-in'
  }

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min) // The maximum is inclusive and the minimum is inclusive
  }
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
    .message-bubble {
      height: 15px;
      margin-bottom: 10px;
    }
  }

  @media screen and (min-width: 768px) {
    #app-title {
      font-size: 6rem;
    }
    .message-bubble {
      height: 30px;
      margin-bottom: 20px;
    }
  }

  #app-title {
    font-family: Roboto, sans-serif; 
    text-align: center; 
    font-weight: 500;
    margin-top: 30vh; 
    margin-bottom: 20px;
    letter-spacing: 0.01em;
    color: rgb(105,105,105);
  }

  /* ease-in means slow start (so visible image stays longer) */
  .fade-out {
    animation: fadeout 3s ease-in 1 forwards;
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

  /* .ball {
    border-radius: 25px;
    width: 50px;
    height: 50px;
    background: #c00;
    position: absolute;
    top: 0;
    left: 0;
    transition: transform 1s;
  } */
</style>

