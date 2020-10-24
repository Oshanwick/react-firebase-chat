import React, { useRef, useState } from "react";
import "./App.css";
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore';
import 'firebase/analytics';






import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyCksleRinbELKrrXdg5fo72xlCERZDkMqQ",
  authDomain: "chatapp-80e49.firebaseapp.com",
  databaseURL: "https://chatapp-80e49.firebaseio.com",
  projectId: "chatapp-80e49",
  storageBucket: "chatapp-80e49.appspot.com",
  messagingSenderId: "1092330329035",
  appId: "1:1092330329035:web:90c415d71525fb24f4dc4e",
  measurementId: "G-1SJMTBP9M5"
})
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
        <SignOut />
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}





function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
    </>
  )
}



function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>)

  )
}


function ChatRoom() {
  const dummy = useRef()
  const messagesRef = firestore.collection("meesages");
  const query = messagesRef.orderBy("createdAt");

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,


    });

    setFormValue('');

    dummy.current.scroll({ behavior: 'smooth' });
  };

  return (
    <>
      <main>
        {messages && messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy}></div>





      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type a message" />

        <button type="submit" disabled={!formValue}>🕊️</button>
      </form>


    </>
  )
}

function ChatMessage(props) {



  const { text, uid, photoURL, createdAt } = props.message;


  var n = new Date(createdAt * 1000).toLocaleTimeString()


  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (<>





    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />

      <p1>{text}<p>{n}</p></p1>








    </div>

  </>)
}
export default App;


