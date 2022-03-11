<div>
  I will fetch and display all the messages here
</div>

<script>
  export let friendUID

  import { where, getDocs, query, collection } from 'firebase/firestore'
  import db from './db';

  $: if (friendUID) {
    console.log("friendUID =", friendUID)

    const ref = collection(db, 'chats')
    const q = query(ref, where('participantUIDs', 'array-contains', friendUID))
    getDocs(query).then(result => {
      console.log('result =', result)
    })
  }
</script>