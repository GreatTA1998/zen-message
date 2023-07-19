import { doc, collection, getDoc, getDocs, setDoc, updateDoc, arrayUnion, onSnapshot, arrayRemove } from "firebase/firestore"
import db from './db.js'

export async function addFriend ({ uid1, name2, uid2, category = 'Family' }) {
  const ref = doc(db, 'users', uid1)
  await updateDoc(ref, {
    friends: arrayUnion({ name: name2, uid: uid2, category })
  })

  const chatRoomID = uid1 < uid2 ? (uid1 + uid2) : (uid2 + uid1)
  const chatRef = doc(db, 'chats', chatRoomID)
  await setDoc(chatRef, {
    participantUIDs: [uid1, uid2],
    messages: []
  })
}

export function getRandomID () {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let autoId = '';
  for (let i = 0; i < 20; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return autoId;
}

/**
 * Displays the date in the user's local time
 * 
 * @param {String} dateString  an ISO string
 * @returns a human readable form of the date e.g. March 24th 5:46
 */
 export const displayDate = function (dateString, format = {
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'utc',
}) 
{ 
  const deserializedDate = new Date(dateString)
  let currentTimeZoneOffset = deserializedDate.getTimezoneOffset() * 60000;
  return new Date(deserializedDate - currentTimeZoneOffset).toLocaleDateString(
    'en-US',
    format
  );
} 