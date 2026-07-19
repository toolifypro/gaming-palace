import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey:  "AIzaSyA34p9etp_BjR1O8MisCs0--C6ZSUr3JWY",
  authDomain: "gaming-beast-f73e3.firebaseapp.com",
  projectId: "gaming-beast-f73e3",
  storageBucket: "gaming-beast-f73e3.firebasestorage.app",
  messagingSenderId: "944830655424",
  appId: "1:944830655424:web:98a2c02fe975175ca8b625"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Keep user logged in after refresh
await setPersistence(auth, browserLocalPersistence);

// Google Provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account"
});

// Firestore
const db = getFirestore(app);

// Export everything
export { auth, provider, db };
