// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getAuth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8HxiU25fxvZjEUagY3JK3IDj6Ed5vGUw",
  authDomain: "webgame-a0345.firebaseapp.com",
  projectId: "webgame-a0345",
  storageBucket: "webgame-a0345.appspot.com",
  messagingSenderId: "175657023443",
  appId: "1:175657023443:web:a81965cd31fce13971a126",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

let account = false;
let loggedInUser;
let userID;
let characterUser;
let position = {};
window.popUp = false;
const startGame = document.querySelector(".startGame");
const canvas = document.querySelector(".canvas");
const roomCanvas = document.querySelector(".roomCanvas");

const start = document.querySelector(".startButton");

function randomize() {
  let x = Math.floor(Math.random() * 16) * 16;
  let y = Math.floor(Math.random() * 9) * 16;

  position = {
    x,
    y,
  };
}

const anonArray = [
  "James<i>(Anon)</i>",
  "Daniel<i>(Anon)</i>",
  "Donny<i>(Anon)</i>",
  "Alden<i>(Anon)</i>",
  "Dingdong<i>(Anon)</i>",
];

function nameChooser() {
  let index = Math.floor(Math.random() * 5);

  return anonArray[index];
}

const emailRegex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
const usernameRegex = new RegExp("[a-zA-z0-9_]{6}");
const passwordRegex = new RegExp("[a-zA-z0-9_]{8}");
let userOK, emailOK, passwordOK;

userOK = emailOK = passwordOK = false;

function validate() {
  console.log(userOK);
  console.log(emailOK);
  console.log(passwordOK);

  if (userOK == true && emailOK == true && passwordOK == true) {
    document.querySelector(".signupSubmit").removeAttribute("disabled");
  } else {
    document.querySelector(".signupSubmit").setAttribute("disabled", "true");
    document.querySelector(".signupUsername").style.border = "2px solid red";
    document.querySelector(".signupEmail").style.border = "2px solid red";
    document.querySelector(".signupPassword").style.border = "2px solid red";
  }
}

onSnapshot(collection(db, "players"), (players) => {
  players.docChanges().forEach((player) => {
    if (player.type == "added") {
      let character = document.createElement("div");
      character.classList.add("square");
      character.innerHTML = `<div class="nameTag">${
        player.doc.data().name
      }</div>`;
      character.style.position = "absolute";
      character.style.marginTop = `${player.doc.data().y}px`;
      character.style.marginLeft = `${player.doc.data().x}px`;
      character.classList.add(`div-${player.doc.id}`);
      character.classList.add(`player`);
      canvas.appendChild(character);
    } else if (player.type == "modified") {
      let other = document.querySelector(`.div-${player.doc.id}`);
      other.style.marginTop = `${player.doc.data().y}px`;
      other.style.marginLeft = `${player.doc.data().x}px`;
    } else if (player.type == "removed") {
      let other = document.querySelector(`.div-${player.doc.id}`);
      other.parentNode.removeChild(other);
    }
  });
});

start.addEventListener("click", () => {
  signInAnonymously(auth).then((user) => {
    userID = user.user.uid;
    loggedInUser = auth.currentUser;

    startGame.classList.add("hide");
    roomCanvas.classList.remove("hide");

    randomize();

    setDoc(doc(db, "players", `${user.user.uid}`), {
      name: `${nameChooser()}`,
      playerID: user.user.uid,
      x: position.x,
      y: position.y,
    });

    document.querySelectorAll(".chatChat").forEach((chat) => {
      chat.parentNode.removeChild(chat);
    });

    getDocs(
      query(collection(db, "messages"), orderBy("createdAt", "asc"))
    ).then((messages) => {
      messages.docChanges().forEach((message) => {
        if (message.type == "added") {
          if (message.doc.data().recipient == userID) {
            document.querySelector(
              ".chatContainer"
            ).innerHTML += `<div class="chatChat right id-${
              message.doc.id
            }"><div class="message" style="background: #37946e;">${
              message.doc.data().message
            }</div><p class="from">${message.doc.data().recipient}</p></div>`;

            document.querySelector(`.id-${message.doc.id}`).scrollIntoView();
          } else {
            document.querySelector(
              ".chatContainer"
            ).innerHTML += `<div class="chatChat left id-${
              message.doc.id
            }"><div class="message" style="background: #304c40;">${
              message.doc.data().message
            }</div><p class="from">${message.doc.data().recipient}</p></div>`;

            document.querySelector(`.id-${message.doc.id}`).scrollIntoView();
          }
        }
      });
    });

    userOK = emailOK = passwordOK = false;
    document.querySelector(".logout").classList.remove("hide");
    document.querySelector(".chatLogo").classList.remove("hide");
    document.querySelector(".chatSection").classList.remove("hide");
    characterUser = document.querySelector(`.div-${user.user.uid}`);
  });
});

function close() {
  document.querySelector(".movieResponse").src = "";
  document.querySelector(".movieInfo").innerHTML = "";

  document.querySelector(".tvPopup").style.top = "150%";
  document.querySelector(".signupPopup").style.top = "150%";
  document.querySelector(".loginPopup").style.top = "150%";
  setTimeout(() => {
    document.querySelector(".tvPopup").classList.add("hide");
    document.querySelector(".signupPopup").classList.add("hide");
    document.querySelector(".loginPopup").classList.add("hide");
  }, 200);
  window.popUp = false;
}

document.querySelector(".signupForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const signupEmail = document.querySelector(".signupForm").email.value;
  const signupUsername = document.querySelector(".signupForm").username.value;
  const signupPassword = document.querySelector(".signupForm").password.value;
  document.querySelector(".signupForm").reset();

  console.log(signupEmail);

  createUserWithEmailAndPassword(auth, signupEmail, signupPassword).then(
    (user) => {
      setDoc(doc(db, "accounts", `${user.user.uid}`), {
        name: signupUsername,
        playerID: user.user.uid,
        email: signupEmail,
        password: signupPassword,
      });
    }
  );

  userOK = emailOK = passwordOK = false;
  validate();
  close();
});

document.querySelector(".signupEmail").addEventListener("input", () => {
  if (emailRegex.test(document.querySelector(".signupEmail").value)) {
    document.querySelector(".signupEmail").style.border = "2px solid green";
    emailOK = true;
  } else {
    document.querySelector(".signupEmail").style.border = "2px solid red";
    emailOK = false;
  }
  validate();
});

document.querySelector(".signupUsername").addEventListener("input", () => {
  if (usernameRegex.test(document.querySelector(".signupUsername").value)) {
    document.querySelector(".signupUsername").style.border = "2px solid green";
    userOK = true;
  } else {
    document.querySelector(".signupUsername").style.border = "2px solid red";
    userOK = false;
  }
  validate();
});

document.querySelector(".signupPassword").addEventListener("input", () => {
  if (passwordRegex.test(document.querySelector(".signupPassword").value)) {
    document.querySelector(".signupPassword").style.border = "2px solid green";
    passwordOK = true;
  } else {
    document.querySelector(".signupPassword").style.border = "2px solid red";
    passwordOK = false;
  }
  validate();
});

function incorrect() {
  let popup = document.querySelector(".loginPopup");

  popup.style.left = "51%";
  popup.style.top = "52%";
  setTimeout(() => {
    popup.style.left = "51%";
    popup.style.top = "50%";
  }, 50);
  setTimeout(() => {
    popup.style.left = "50%";
    popup.style.top = "50%";
  }, 100);
}

document.querySelector(".loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const loginEmail = document.querySelector(".loginForm").email.value;
  const loginPassword = document.querySelector(".loginForm").password.value;

  document.querySelector(".loginForm").reset();

  console.log(loginPassword);

  signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    .then((user) => {
      userID = user.user.uid;
      loggedInUser = auth.currentUser;
      getDoc(doc(db, "accounts", userID)).then((data) => {
        let name = data.data().name;

        startGame.classList.add("hide");
        roomCanvas.classList.remove("hide");

        randomize();

        setDoc(doc(db, "players", `${user.user.uid}`), {
          name,
          playerID: user.user.uid,
          x: position.x,
          y: position.y,
        });
      });

      document.querySelectorAll(".chatChat").forEach((chat) => {
        chat.parentNode.removeChild(chat);
      });

      getDocs(
        query(collection(db, "messages"), orderBy("createdAt", "asc"))
      ).then((messages) => {
        messages.docChanges().forEach((message) => {
          if (message.type == "added") {
            if (message.doc.data().recipient == userID) {
              document.querySelector(
                ".chatContainer"
              ).innerHTML += `<div class="chatChat right id-${
                message.doc.id
              }"><div class="message" style="background: #37946e;">${
                message.doc.data().message
              }</div><p class="from">${message.doc.data().recipient}</p></div>`;

              document.querySelector(`.id-${message.doc.id}`).scrollIntoView();
            } else {
              document.querySelector(
                ".chatContainer"
              ).innerHTML += `<div class="chatChat left id-${
                message.doc.id
              }"><div class="message" style="background: #304c40;">${
                message.doc.data().message
              }</div><p class="from">${message.doc.data().recipient}</p></div>`;

              document.querySelector(`.id-${message.doc.id}`).scrollIntoView();
            }
          }
        });
      });

      account = true;
      userOK = emailOK = passwordOK = false;
      validate();
      document.querySelector(".logout").classList.remove("hide");
      document.querySelector(".chatLogo").classList.remove("hide");
      document.querySelector(".chatSection").classList.remove("hide");
      characterUser = document.querySelector(`.div-${user.user.uid}`);

      close();
    })
    .catch((err) => {
      incorrect();
    });
});

document.addEventListener("keydown", function (event) {
  if (window.popUp == false) {
    switch (event.key) {
      case "w":
        if (
          position.y != 0 &&
          (position.x > 32 || position.y > 112 || position.y < 112) &&
          (position.y > 112 ||
            position.y < 64 ||
            position.x < 112 ||
            position.x > 144) &&
          (position.y > 16 || position.x < 96 || position.x > 128) &&
          (position.y > 16 || position.x > 0) &&
          (position.y > 16 || position.x > 64 || position.x < 64) &&
          (position.y > 48 || position.y < 16 || position.x > 0) &&
          (position.y > 48 ||
            position.y < 16 ||
            position.x > 64 ||
            position.x < 64)
        ) {
          position.y -= 16;

          console.log(position.y);
          updateDoc(doc(db, "players", `${userID}`), {
            y: position.y,
          });
        }
        break;
      case "a":
        if (
          position.x != 0 &&
          (position.x > 48 || position.y != 96) &&
          (position.x < 112 ||
            position.x > 160 ||
            position.y > 96 ||
            position.y < 64) &&
          (position.x > 48 || position.y < 128) &&
          (position.x > 16 || position.y > 0) &&
          (position.x > 80 || position.x < 64 || position.y > 0) &&
          (position.x > 144 || position.x < 80 || position.y > 0) &&
          (position.x > 208 || position.x < 144 || position.y > 0) &&
          (position.x > 16 || position.y > 32 || position.y < 32) &&
          (position.x > 80 ||
            position.x < 64 ||
            position.y > 32 ||
            position.y < 32)
        ) {
          position.x -= 16;

          console.log(position.x);

          updateDoc(doc(db, "players", `${userID}`), {
            x: position.x,
          });
        }
        break;
      case "s":
        if (
          position.y < 144 - 16 &&
          (position.x > 32 || position.y > 80 || position.y < 80) &&
          (position.y < 48 ||
            position.y > 96 ||
            position.x < 112 ||
            position.x > 144) &&
          (position.y < 112 || position.x > 32) &&
          (position.y > 16 || position.y < 16 || position.x > 0) &&
          (position.y > 16 ||
            position.y < 16 ||
            position.x > 64 ||
            position.x < 64)
        ) {
          position.y += 16;
          console.log(position.y);

          updateDoc(doc(db, "players", `${userID}`), {
            y: position.y,
          });
        }
        break;
      case "d":
        if (
          position.x < 256 - 16 &&
          (position.x < 96 ||
            position.x > 144 ||
            position.y > 96 ||
            position.y < 64) &&
          (position.x > 80 || position.x < 48 || position.y > 0) &&
          (position.x > 144 || position.x < 144 || position.y > 0) &&
          (position.x > 48 ||
            position.x < 48 ||
            position.y > 32 ||
            position.y < 32)
        ) {
          position.x += 16;

          console.log(position.x);

          updateDoc(doc(db, "players", `${userID}`), {
            x: position.x,
          });
        }
        break;
    }
  }

  if (userID != undefined && window.popUp == false) {
    if (event.key == "/") {
      document.querySelector(".chatSection").style.left = 0;
      window.popUp = true;
    }
  }
});

const chat = document.querySelector(".chatBar");

chat.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = chat.chatInput.value;
  chat.reset();

  console.log(userID);
  console.log(message);

  addDoc(collection(db, "messages"), {
    createdAt: serverTimestamp(),
    recipient: userID,
    message: message,
  });
});

document.querySelector(".logout").addEventListener("click", () => {
  document.querySelector(".logout").classList.add("hide");
  startGame.classList.remove("hide");
  roomCanvas.classList.add("hide");

  document.querySelector(".chatSection").classList.add("hide");
  document.querySelector(".chatLogo").classList.add("hide");

  // document.querySelectorAll(".chatChat").forEach((chat) => {
  //   chat.parentNode.removeChild(chat);
  // });

  if (account == false) {
    deleteUser(loggedInUser);
  }
  deleteDoc(doc(db, "players", `${userID}`));
  userID = undefined;
  account = false;
  document.querySelector(".chatSection").style.left = "-500px";
  window.popUp = false;
});

onSnapshot(
  query(collection(db, "messages"), orderBy("createdAt", "asc")),
  (messages) => {
    messages.docChanges().forEach((message) => {
      if (message.type == "added") {
        if (message.doc.data().recipient == userID) {
          document.querySelector(
            ".chatContainer"
          ).innerHTML += `<div class="chatChat right id-${
            message.doc.id
          }"><div class="message" style="background: #37946e;">${
            message.doc.data().message
          }</div><p class="from">${message.doc.data().recipient}</p></div>`;

          document.querySelector(`.id-${message.doc.id}`).scrollIntoView();
        } else {
          document.querySelector(
            ".chatContainer"
          ).innerHTML += `<div class="chatChat left id-${
            message.doc.id
          }"><div class="message" style="background: #304c40;">${
            message.doc.data().message
          }</div><p class="from">${message.doc.data().recipient}</p></div>`;

          document.querySelector(`.id-${message.doc.id}`).scrollIntoView();
        }
      }
    });
  }
);

window.addEventListener("beforeunload", (e) => {
  e.preventDefault();
  document.querySelector(".logout").classList.add("hide");
  startGame.classList.remove("hide");
  roomCanvas.classList.add("hide");

  document.querySelector(".chatSection").classList.add("hide");
  document.querySelector(".chatLogo").classList.add("hide");

  // document.querySelectorAll(".chatChat").forEach((chat) => {
  //   chat.parentNode.removeChild(chat);
  // });

  if (account == false) {
    deleteUser(loggedInUser);
  }
  deleteDoc(doc(db, "players", `${userID}`));
  userID = undefined;
  account = false;
});
