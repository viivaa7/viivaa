// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA1vjsSaYjUOj4S3FVEXhVfZLSwNMoOYTg",
    authDomain: "viivaa-fc0e1.firebaseapp.com",
    databaseURL: "https://viivaa-fc0e1-default-rtdb.firebaseio.com",
    projectId: "viivaa-fc0e1",
    storageBucket: "viivaa-fc0e1.appspot.com",
    messagingSenderId: "629736113572",
    appId: "1:629736113572:web:2b558513c388c860156d31"
};

// 🔗 Connect to Firebase
firebase.initializeApp(firebaseConfig);

// 📡 Reference the Database
const database = firebase.database();
const soilMoistureRef = database.ref("/soilMoisture");

// 📊 Listen for Changes (Realtime Data)
soilMoistureRef.on("value", (snapshot) => {
    const data = snapshot.val();
    document.getElementById("moisture").innerText = "Soil Moisture: " + data;
});
