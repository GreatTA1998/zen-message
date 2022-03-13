<div style="display: flex; padding-left: 20px; padding-right: 20px;">
  <div style="width: 400px">
    {#if !currentUser}
      {#if !phoneConfirmationResult}
        <div style="display: flex; justify-content: center; align-items: center;">
          <input type="tel" id="phone-input-1" minlength="2" maxlength="3" placeholder="+1" bind:value={countryCode} style="width: 36px; height: 40px; font-size: 2rem; margin-right: 10px">

          <input type="tel" id="phone-input-1" minlength="3" maxlength="3" placeholder="339" bind:value={phoneNumSegment1} style="width: 54px; height: 40px; font-size: 2rem; margin-right: 10px">

          <input type="tel" id="phone-input-2" minlength="3" maxlength="3" placeholder="676" bind:value={phoneNumSegment2} style="width: 54px; height: 40px; font-size: 2rem; margin-right: 10px">

          <input type="tel" id="phone-input-3" minlength="4" maxlength="4" placeholder="1234" bind:value={phoneNumSegment3} style="width: 76px; height: 40px; font-size: 2rem; margin-right: 10px">
          
          <div id="sign-in-button" on:click={signInWithPhone} style="border: solid; padding: 6px;">
            Sign Up
          </div>
        </div>  
      {:else}
        <div style="display: flex">
          <input label="6-digit code" placeholder="123456" bind:value={phoneConfirmCode}>
          <div on:click={verifyConfirmationCode}>Confirm code</div>
        </div>
      {/if}  

    {:else}
      <h2 class="message-group-title">Friends</h2>
      {#each currentUser.friends as friend}
        <div on:click={() => currentFriendUID = friend.uid} style="border: solid orange; height: 40px; display: flex; align-items: center;" class:highlighted-box={currentFriendUID}>
          <span style="margin-left: 5px">
            {friend.name}{friendUIDsWithNewMessages.includes(friend.uid) ? 'New messages' : ''}
          </span>
        </div>
      {/each}

      <button style="margin-top: 20px;" on:click={() => isAddingFriend = true}>Add new friend</button>

      {#if isAddingFriend}
        Below are all the accounts that exist on Zen Messenger, click to add as friend:
        {#each accounts as account} 
          <div on:click={() => addFriend(account)} style="margin-left: 20px;">
            {account.name}
          </div>
        {/each}
      {/if}

      <h2 class="message-group-title" style="margin-top: 50px;">Family</h2>
      No family...

      <h2 class="message-group-title" style="margin-top: 50px;">Other VIPs</h2>
      No VIPs yet...

      <h2 class="message-group-title" style="margin-top: 50px;">Everyone else</h2>
      No new message requests yet...
    {/if}
  </div>

  <div style="width: 60%; margin-left: 20px; margin-top: 5px;">
    {#if currentFriendUID && currentUser}
      <ChatWindow 
        friendUID={currentFriendUID} 
        {currentUser}
      />
    {:else if currentUser}
      <div style="margin-top: 18px;">
        Click any chat on the left-side
      </div> 
      <div>Set your name here</div>
      <input placeholder="John Apple" bind:value={newUserName}>
      <button on:click={updateUserName}>Update name</button>
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
  import { doc, collection, getDoc, getDocs, setDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore"
  import ChatWindow from '../chatWindow.svelte'
  import { getRandomID } from '../helpers.js'

  let unsub

  let appVerifier
  let countryCode = '+1'
  let phoneNumSegment1 = ''
  let phoneNumSegment2 = ''
  let phoneNumSegment3 = ''
  let phoneConfirmationResult
	let phoneConfirmCode = ''

  let friendUIDsWithNewMessages = [] 

  $: if (phoneNumSegment1.length === 3) {
		document.getElementById('phone-input-2').focus()
	}
	$: if (phoneNumSegment2.length === 3) {
		document.getElementById('phone-input-3').focus()
	}
	$: if (phoneNumSegment3.length === 4) {
		signInWithPhone()
	}
  
  function signInWithPhone () {
    console.log('signInWithPhone()')
    if (!window.recaptchaVerifier) {
			window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
				'size': 'invisible',
				'callback': (response) => {
					// reCAPTCHA solved, allow signInWithPhoneNumber.
					console.log('reCAPTCHA solved =', response)
					// onSignInSubmit()
				}
			}, getAuth())
			appVerifier = window.recaptchaVerifier;
		}
		onSignInSubmit();
		function onSignInSubmit () {
			const phoneNumber = `${countryCode} ${phoneNumSegment1}-${phoneNumSegment2}-${phoneNumSegment3}`
			print(getAuth(), phoneNumber, appVerifier)
			signInWithPhoneNumber(getAuth(), phoneNumber, appVerifier)
				.then((confirmationResult) => {
					console.log('confirmation result =', confirmationResult)
					phoneConfirmationResult = confirmationResult
					// SMS sent. Prompt user to type the code from the message, then sign the
					// user in with confirmationResult.confirm(code).
					window.confirmationResult = confirmationResult
					// ...
				}).catch((error) => {
					alert(error)
					console.log('error =', error)
					// Error; SMS not sent
					// ...
			
					// if it fails, reset 
					// grecaptcha.reset(window.recaptchaWidgetId);
			
					// Or, if you haven't stored the widget ID:
					window.recaptchaVerifier.render().then(function(widgetId) {
						grecaptcha.reset(widgetId);
					})
				});
			}
		}
		// SIGN IN WITH CONFIRMATION CODE
		function verifyConfirmationCode () {
			console.log('phoneConfirmCode =', phoneConfirmCode)
			window.confirmationResult.confirm(phoneConfirmCode).then((result) => {
				// User signed in successfully
        // `authStateChange` will handle the rest

				// const user = result.user;
				// console.log('redirecting, user =', user)
				// goto('AsUl1VWQ7zzxZsD5epL7/AsUl1VWQ7zzxZsD5epL7', { replaceState: true })
				// ...
			}).catch((error) => {
				alert(error)
				// User couldn't sign in (bad verification code?)
				// ...
			});

  }

  const auth = getAuth();

  let currentUser = null
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
    for (const friend of currentUser.friends) {
      if (friend.uid === uid) {
        alert("You're already friends")
        isAddingFriend = false
        return 
      }
    }

    const ref = doc(db, 'users', currentUser.uid)
    console.log('name, uid =', name, uid)
    await updateDoc(ref, {
      friends: arrayUnion({ name, uid })
    })

    // create a chat room 
    const chatRef = doc(db, 'chats', getRandomID())
    await setDoc(chatRef, {
      participantUIDs: [uid, currentUser.uid],
      messages: []
    })
    isAddingFriend = false
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        currentUser = docSnap.data()
      } else {
        const initialUserDoc =  {
          uid: user.uid,
          name: user.displayName || 'John Apple',
          phoneNumber: user.phoneNumber,
          friends: [],
          family: [],
          VIPs: [],
          everyoneElse: []
        }
        await setDoc(doc(db, 'users', user.uid), initialUserDoc)
        currentUser = initialUserDoc
      }

      unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
        currentUser = snap.data()
        if (currentUser.friendUIDsWithNewMessages) {
          friendUIDsWithNewMessages = currentUser.friendUIDsWithNewMessages
        }
      });
    } 
  })
  
  async function updateUserName () {
    const ref = 
    await updateDoc(doc(db, 'users', currentUser.uid), {
      name: newUserName
    })
    newUserName = ''
    alert('successfully updated')
  }
</script>

<style>
  .highlighted-box {
    background-color: orange;
  }

  span:hover {
    background-color: cyan;
  }

  .message-group-title {
    font-family: Roboto, sans-serif; 
    font-weight: 600; 
    color: rgb(119, 110, 110);
    margin-bottom: 5px;
  }
</style>
