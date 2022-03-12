<div style="display: flex;">
  <div>
    {#if !currentUser}
      <button on:click={signUp}>Sign up</button>
    {:else}
      <h2>Friends</h2>
      {#each currentUser.friends as friend}
        <div on:click={() => currentFriendUID = friend.uid}>
          {friend.name}
        </div>
      {/each}

      <button on:click={() => isAddingFriend = true}>Add new friend</button>

      {#if isAddingFriend}
        {#each accounts as account} 
          <div on:click={() => addFriend(account)}>
            {account.name}
          </div>
        {/each}
      {/if}

      <h2>Family</h2>

      <h2>Other VIPs</h2>

      <h2>Everyone else</h2>
    {/if}
  </div>

  <div>
    {#if currentFriendUID}
      <ChatWindow friendUID={currentFriendUID}/>
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

