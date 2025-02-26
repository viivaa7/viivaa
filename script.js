// 🔥 Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyA1vjsSaYjUOj4S3FVEXhVfZLSwNMoOYTg",
    authDomain: "viivaa-fc0e1.firebaseapp.com",
    databaseURL: "https://viivaa-fc0e1-default-rtdb.firebaseio.com",
    projectId: "viivaa-fc0e1",
    storageBucket: "viivaa-fc0e1.firebasestorage.app",
    messagingSenderId: "629736113572",
    appId: "1:629736113572:web:2b558513c388c860156d31"
};

// 🔗 Initialize Firebase
firebase.initializeApp(firebaseConfig);

// 📡 Reference to Firebase Database
const database = firebase.database();
const soilMoistureRef = database.ref("/soilMoisture");
const lastUpdatedRef = database.ref("/lastUpdated");

// 📊 Listen for Real-time Changes
soilMoistureRef.on("value", (snapshot) => {
    const data = snapshot.val();
    document.getElementById("moisture").innerText = data + "%";
});

// ⏰ Fetch and Display Last Updated Time
lastUpdatedRef.on("value", (snapshot) => {
    const timestamp = snapshot.val();
    if (timestamp) {
        const date = new Date(timestamp);
        document.getElementById("last-updated").innerText = date.toLocaleString();
    } else {
        document.getElementById("last-updated").innerText = "-";
    }
});

// 💦 Toggle Irrigation System
function toggleIrrigation(state) {
    database.ref("/Irrigation").set(state);
    database.ref("/lastUpdated").set(Date.now()); // Update timestamp when irrigation changes
    alert("Irrigation turned " + (state ? "ON" : "OFF"));
}
