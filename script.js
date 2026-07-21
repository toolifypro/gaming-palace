import { auth, provider, db } from './fire.js'; // Verify karein agar file ka naam fire.js hai
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';

// DOM Elements
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const navProfileSection = document.getElementById("navProfileSection");

const navUserName = document.getElementById("navUserName");
const navUserAvatar = document.getElementById("navUserAvatar");

// Page Profile Elements (if on profile page)
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userAvatar = document.getElementById("userAvatar");

// Google Login Handler
loginBtn?.addEventListener('click', async (e) => {
  // Prevent page navigation if it's a link click
  if (loginBtn.tagName === 'A') {
    e.preventDefault();
  }

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        username: user.displayName || 'Beast Player',
        email: user.email,
        avatar: user.photoURL || '',
        banner: '',
        bio: 'Welcome to Gaming Beast!',
        level: 1,
        xp: 0,
        coins: 100,
        streak: 1,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
    } else {
      await updateDoc(userRef, {
        lastLogin: serverTimestamp()
      });
    }

    console.log('Login successful');
  } catch (error) {
    console.error('Login Error:', error);
    alert('Login failed: ' + error.message);
  }
});

// Logout Handler
logoutBtn?.addEventListener('click', async () => {
  try {
    await signOut(auth);
    console.log('Logged out successfully');
  } catch (error) {
    console.error('Logout Error:', error);
  }
});

// Auth State Listener (Auto Update UI)
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is Logged In
    loginBtn?.classList.add('hidden');
    navProfileSection?.classList.remove('hidden');

    let profile = {};
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        profile = userSnap.data();
      }
    } catch (err) {
      console.error("Firestore Fetch Error:", err);
    }

    const avatar = profile.avatar || user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`;
    const username = profile.username || user.displayName || "Beast Player";
    const email = profile.email || user.email;

    // Update Navbar UI
    if (navUserAvatar) navUserAvatar.src = avatar;
    if (navUserName) navUserName.textContent = username;

    // Update Main Profile Page (if user is on profile page)
    if (userAvatar) userAvatar.src = avatar;
    if (userName) userName.textContent = username;
    if (userEmail) userEmail.textContent = email;

  } else {
    // User is Logged Out / Guest
    loginBtn?.classList.remove('hidden');
    navProfileSection?.classList.add('hidden');

    if (navUserName) navUserName.textContent = "Guest";
    if (navUserAvatar) navUserAvatar.src = "https://api.dicebear.com/7.x/bottts/svg?seed=Guest";
  }
});
