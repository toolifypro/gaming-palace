import { auth, provider } from "./firebase.js";

import {
    signInWithPopup,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const loginBtn = document.getElementById("googleLogin");

// Agar already login hai to seedha home page bhej do
onAuthStateChanged(auth, (user) => {

    if(user){
        window.location.href="index.html";
    }

});

// Google Login
loginBtn.addEventListener("click", async ()=>{

    try{

        await signInWithPopup(auth, provider);

        window.location.href="index.html";

    }catch(err){

        alert(err.message);
        console.log(err);

    }

});
