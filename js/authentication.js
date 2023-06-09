// Your web app's Firebase configuration

//import { initializeApp } from "firebase/app";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js';


var firebaseConfig = {
  apiKey: "AIzaSyBqPKAyQ9gD0q5RG4BOBgDI2J5IIfCjOAg",
  authDomain: "itirod-8b96a.firebaseapp.com",
  projectId: "itirod-8b96a",
  storageBucket: "itirod-8b96a.appspot.com",
  messagingSenderId: "737137539042",
  appId: "1:737137539042:web:7dc94c91d4f44dfefbabbb"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize variables
const auth = getAuth(app);
console.log(auth);
const reg = document.getElementById("register");
const login = document.getElementById("login");
if (reg != null) {
  registration();
}
console.log(reg);

function registration() {
reg.addEventListener("click", (e) => {
  console.log("qwergf");
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  console.log(email, password);

  /*if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!')
    return
    // Don't continue running the code
  }*/

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      alert("user created!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      alert(errorMessage);
    });
});
}
// Set up our register function
login.addEventListener("click", (e) => {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  console.log(email, password);

//   if (validate_email(email) == false) {
//     alert('Email is not correct')
//   }

//   if (validate_password(pasxsword) == false) {
//     alert('Password is not correct')
//   }

signInWithEmailAndPassword(auth, email, password)
.then((userCredential) => {

  const user = userCredential.user;


  alert("User loged in!");

  setTimeout(function () {
    window.location.href = "index.html";
  }, 1000);
})
.catch((error) => {
  const errorCode = error.code;
  const errorMessage = error.message;

  alert(errorMessage);
});
});
// Set up our login function




// Validate Functions
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false
  } else {
    return true
  }
}
