<div style="display: flex; padding-left: 0px; padding-right: 0px;">
  <div>
    {#if !currentUser}
      {#if !phoneConfirmationResult}
        <div style="font-family: Roboto, sans-serif; font-size: 1.5rem; color: grey; margin-top: 20px;">
          <b>What problem does this solve:</b>
          Everytime someone messages us, we get a notification IMMEDIATELY, regardless of whether the message is time-sensitive, or even important. 
          Even if you try to ignore it, visually they go to the top of our chat list; 
          if you visited Messenger for a specific purpose, the top message distractions will help you forget what you were doing.
          Multiply that by all the people you message across time, and it's a disaster . 

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

        <div style="display: flex; justify-content: center; align-items: center; width: 400px; margin-top: 25px;">
          <input type="tel" id="phone-input-1" minlength="2" maxlength="4" placeholder="+1" bind:value={countryCode} style="width: 36px; height: 40px; font-size: 2rem; margin-right: 10px">

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
          <button on:click={verifyConfirmationCode}>Confirm code</button>
        </div>
      {/if}  

    {:else}
      <div style="width: 100px;">
        <h2 class="message-group-title">
          People
        </h2>
        {#each currentUser.friends as friend}
          <div 
            on:click={() => currentFriendUID = friend.uid} 
            style="border: solid orange; height: 40px; display: flex; align-items: center;"
            class:highlighted-box={friend.uid === currentFriendUID}
          >
            <span style="margin-left: 5px">
              {friend.name}{friendUIDsWithNewMessages.includes(friend.uid) ? 'New messages' : ''}
            </span>
          </div>
        {/each}

        <button style="margin-top: 20px;" on:click={() => isAddingFriend = !isAddingFriend}>
          Add person
        </button>

        {#if isAddingFriend}
          <div>Here are all accounts:</div>
          {#each accounts as account} 
            {#if account.uid !== currentUser.uid}
              <div style="margin-top: 10px;">
                <button on:click={() => addFriend(account)} style="margin-left: 20px;">
                  {account.name}
                </button>
              </div>
            {/if}
          {/each}
        {/if}

        <!-- <h2 class="message-group-title" style="margin-top: 50px;">Family</h2>
        No family... -->

        <h2 class="message-group-title" style="margin-top: 50px;">Editable category</h2>
        Coming soon...

        <h2 class="message-group-title" style="margin-top: 50px;">Everyone else</h2>
        No new message requests yet...
      </div>
    {/if}
  </div>

  <div style="width: 320px; margin-left: 5px; margin-top: 5px;">
    {#if currentFriendUID && currentUser && chatRoomID}
      {#key currentFriendUID}
        <ChatWindow 
          {chatRoomID}
          friendUID={currentFriendUID} 
          otherPersonUID={currentFriendUID}
          {currentUser}
        />
      {/key}
    {:else if currentUser}
      <div style="margin-top: 5px; margin-bottom: 12px;">
        Click any chat on the left-side
      </div> 
      <!-- <div>Set your name here</div> -->
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

  let chatRoomID = ''

  $: if (currentFriendUID) {
    chatRoomID = currentUser.uid < currentFriendUID ? (currentUser.uid + currentFriendUID) : (currentFriendUID + currentUser.uid)
    console.log('chatRoomID =', chatRoomID)
  }


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
    await updateDoc(ref, {
      friends: arrayUnion({ name, uid })
    })

    const chatRoomID = currentUser.uid < uid ? (currentUser.uid + uid) : (uid + currentUser.uid)
    const chatRef = doc(db, 'chats', chatRoomID)
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
    margin-top: 5px;
    margin-bottom: 5px;
  }
</style>
