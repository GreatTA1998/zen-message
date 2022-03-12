<div style="display: flex;">
  <div>
    {#if !currentUser}
      <button on:click={signUp}>Sign up</button>
    {:else}
      <h2>Friends</h2>
      {#each currentUser.friends as friend}
        <span on:click={() => currentFriendUID = friend.uid} class:highlighted-box={currentFriendUID}>
          {friend.name}
        </span>
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

      <h2>Family</h2>

      <h2>Other VIPs</h2>

      <h2>Everyone else</h2>
    {/if}
  </div>

  <div style="width: 80%; margin-left: 20px">
    {#if currentFriendUID && currentUser}
      <ChatWindow 
        friendUID={currentFriendUID} 
        {currentUser}
      />
    {:else}
      By default no messages will be displayed until you click something, so you don't get distracted by something just because it's the most recent interaction you had. 
    {/if}
  </div>
  <!-- Place to type new message -->
  <!-- Place to specify frequency -->
</div>


<script>
  const chatID = ''
  const allFriends = [] 
  const allFamily = [] 
  const everyoneElse = [] 

  import db from '../db.js'
  import { GoogleAuthProvider, signInWithPopup, getAuth, onAuthStateChanged } from "firebase/auth"
  import { doc, collection, getDoc, getDocs, setDoc, updateDoc, arrayUnion } from "firebase/firestore"
  import ChatWindow from '../chatWindow.svelte'
  import { getRandomID } from '../helpers.js'

  const provider = new GoogleAuthProvider()
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
    console.log('accounts =', accounts)
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
      console.log('auth user =', user)
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        currentUser = docSnap.data()
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        
        const initialUserDoc =  {
          uid: user.uid,
          name: user.displayName,
          friends: [],
          family: [],
          VIPs: [],
          everyoneElse: []
        }
      
        await setDoc(doc(db, 'users', user.uid), initialUserDoc)
        currentUser = initialUserDoc
      }
      console.log('currentUser =', currentUser)
    } 
  })

  function signUp () {
    signInWithPopup(auth, provider)
    .then((result) => {
      alert(result)
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
    }).catch((error) => {
      alert(error)
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  }
</script>

<style>
  .highlighted-box {
    background-color: orange;
  }

  span:hover {
    background-color: cyan;
  }
</style>
