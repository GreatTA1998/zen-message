<div>{currentFriendUID}</div>
{#if !currentUser}
  <button on:click={signUp}>Sign up</button>
{:else}
  <h1>Messenger</h1>

  <h3>Friends</h3>
  {#each currentUser.friends as friend}
    <button on:click={() => currentFriendUID = friend.uid}>{friend.name}</button>
  {/each}

  <button on:click={() => isAddingFriend = true}>Add friend</button>

  {#if isAddingFriend}
    {#each accounts as account} 
      <div on:click={() => addFriend(account)}>
        {account.name}
      </div>
    {/each}
  {/if}

  <h3>Family</h3>

  <h3>Other VIPs</h3>

  <h3>Everyone else</h3>

  {#if currentFriendUID}
    <ChatUI friendUID={currentFriendUID}/>
  {/if}

  <!-- Create an account -->

  <!-- Add new person UI 
    Irreversible for now
  -->

  <!-- Message UI -->
  <!-- Display all messages from the chat room 
    participants: [<uid-1>, <uid-2>]
    chatRooms.where('participants', 'array-contains', uid) // what if they have multiple chats? ignore if it doesn't contain my ID
  -->
  <!-- Place to type new message -->
  <!-- Place to specify frequency -->
  <div>
    As soon as you can
  </div>
  <div>
    1 hour 
  </div>
  <div>
    Today
  </div>
  <div>
    This week
  </div>
  <div>
    This month
  </div>
  <div>
    Anytime
  </div>
{/if}

<script>
  // fetch the user doc


  const chatID = ''
  const allFriends = [] 
  const allFamily = [] 
  const everyoneElse = [] 

  import db from '../db.js'
  import { GoogleAuthProvider, signInWithPopup, getAuth, onAuthStateChanged } from "firebase/auth"
  import { doc, collection, getDoc, getDocs, setDoc, updateDoc, arrayUnion } from "firebase/firestore"
  import ChatUI from '../ChatUI.svelte'

  const provider = new GoogleAuthProvider()
  const auth = getAuth();

  let currentUser = null
  let currentFriendUID = ''
  let accounts = []
  let isAddingFriend = false 


  const docsRef = collection(db, 'users')
  const users = getDocs(docsRef).then(snap => {
    snap.docs.forEach(doc => {
      accounts.push({ uid: doc.id, ...doc.data() })
    })
    console.log('accounts =', accounts)
  })

  async function addFriend ({ name, uid }) {
    const ref = doc(db, 'users', currentUser.uid)
    console.log('name, uid =', name, uid)
    await updateDoc(ref, {
      friends: arrayUnion({ name, uid })
    })
    alert('added friend successfully')
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

