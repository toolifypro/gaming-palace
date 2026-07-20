import { auth, provider, db } from './firebase.js';
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

// Elements
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const navUserName = document.getElementById('navUserName');
const navUserAvatar = document.getElementById('navUserAvatar');

// Google Login
loginBtn?.addEventListener('click', async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Reference to Firestore document
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    // Create profile if first login
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
      // Update last login
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

// Logout
logoutBtn?.addEventListener('click', async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout Error:', error);
  }
});

// Auto Login State
onAuthStateChanged(auth, async (user) => {

  if (user) {

    loginBtn?.classList.add('hidden');
    userInfo?.classList.remove('hidden');

    // Get Firestore Profile
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    let profile = {};

    if (userSnap.exists()) {
      profile = userSnap.data();
    }

    // Avatar
    const avatar =
      profile.avatar ||
      user.photoURL ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${user.displayName}`;

    // Username
    const username =
      profile.username ||
      user.displayName ||
      "Beast Player";

    // Email
    const email =
      profile.email ||
      user.email;

    // Existing UI
    if (userAvatar) userAvatar.src = avatar;
    if (userName) userName.textContent = username;
    if (userEmail) userEmail.textContent = email;

    // Navbar UI
    if (navUserAvatar) navUserAvatar.src = avatar;
    if (navUserName) navUserName.textContent = `${username} 👋`;

  } else {

    loginBtn?.classList.remove('hidden');
    userInfo?.classList.add('hidden');

    if (navUserName)
      navUserName.textContent = "Guest";

    if (navUserAvatar)
      navUserAvatar.src =
        "https://api.dicebear.com/7.x/bottts/svg?seed=Guest";
  }

});
