// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
// import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyCEhiQp5iGz_M-X2-2xnL2iKYYM700CQJU",
//     authDomain: "air-quality-monitoring-faf7e.firebaseapp.com",
//     // databaseURL: "https://air-quality-monitoring-faf7e-default-rtdb.asia-southeast1.firebasedatabase.app",
//     databaseURL: "https://air-quality-monitoring-faf7e-default-rtdb.asia-southeast1.firebasedatabase.app/",
//     projectId: "air-quality-monitoring-faf7e",
//     storageBucket: "air-quality-monitoring-faf7e.appspot.com",
//     messagingSenderId: "508403528800",
//     appId: "1:508403528800:web:8387e253d14cfbd4057f05"
// };
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // Initialize Firebase

// // Get a list of cities from your database
// async function getStats(db) {
//     const citiesCol = collection(db, 'test');
//     // console.log(citiesCol)
//     const citySnapshot = await getDocs(citiesCol);
//     console.log("here********************")
//   const cityList = citySnapshot.docs.map(doc => doc.data());
//   console.log(cityList)
//   return cityList;
// }
// // Assuming getStats returns an array of cities
// let cityList = getStats(db);

// // Now you can use cityList
// console.log(cityList);


















// rtdb
// Import the functions you need from the SDKs you need



// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, get } from "firebase/database";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyCEhiQp5iGz_M-X2-2xnL2iKYYM700CQJU",
//     authDomain: "air-quality-monitoring-faf7e.firebaseapp.com",
//     databaseURL: "https://air-quality-monitoring-faf7e-default-rtdb.asia-southeast1.firebasedatabase.app",
//     projectId: "air-quality-monitoring-faf7e",
//     storageBucket: "air-quality-monitoring-faf7e.appspot.com",
//     messagingSenderId: "508403528800",
//     appId: "1:508403528800:web:8387e253d14cfbd4057f05"
// };

// // Initialize Firebase app
// const app = initializeApp(firebaseConfig);

// // Get a reference to the Realtime Database
// const db = getDatabase(app);

// // Function to fetch data from Realtime Database
// async function getStats(db) {
//     const citiesRef = ref(db, 'test');
//     const citySnapshot = await get(citiesRef);
//     const cityList = [];
//     citySnapshot.forEach(childSnapshot => {
//         cityList.push(childSnapshot.val());
//     });
//     return cityList;
// }

// // Fetch data from Realtime Database
// getStats(db)
//     .then(cityList => {
//         console.log("City List:", cityList);
//     })
//     .catch(error => {
//         console.error("Error fetching data:", error);
//     });



















// sending to frontend
// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCEhiQp5iGz_M-X2-2xnL2iKYYM700CQJU",
//   authDomain: "air-quality-monitoring-faf7e.firebaseapp.com",
//   databaseURL:
//     "https://air-quality-monitoring-faf7e-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "air-quality-monitoring-faf7e",
//   storageBucket: "air-quality-monitoring-faf7e.appspot.com",
//   messagingSenderId: "508403528800",
//   appId: "1:508403528800:web:8387e253d14cfbd4057f05",
// };

// // Initialize Firebase app
// setTimeout(() => {
//     firebase.initializeApp(firebaseConfig);

//     // Get a reference to the Realtime Database
//     const db = firebase.database();

//     // Function to fetch data from Realtime Database and display it on the webpage
//     function displayCityList() {
//     const cityListRef = db.ref("test");
//     const cityListElement = document.getElementById("city-list");

//     cityListRef.once(
//         "value",
//         (snapshot) => {
//         snapshot.forEach((childSnapshot) => {
//             const cityData = childSnapshot.val();
//             const cityListItem = document.createElement("li");
//             cityListItem.textContent = `${cityData.name}: ${cityData.population}`;
//             cityListElement.appendChild(cityListItem);
//         });
//         },
//         (error) => {
//         console.error("Error fetching data:", error);
//         }
//     );
//     }

//     // Call the function to display the city list when the page is loaded
//     window.onload = displayCityList;
// }, 5000);













//express servers

import express from 'express';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import cors from 'cors';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCEhiQp5iGz_M-X2-2xnL2iKYYM700CQJU",
    authDomain: "air-quality-monitoring-faf7e.firebaseapp.com",
    databaseURL: "https://air-quality-monitoring-faf7e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "air-quality-monitoring-faf7e",
    storageBucket: "air-quality-monitoring-faf7e.appspot.com",
    messagingSenderId: "508403528800",
    appId: "1:508403528800:web:8387e253d14cfbd4057f05"
};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the Realtime Database
const db = getDatabase(firebaseApp);

// Function to fetch data from Realtime Database
async function getStats(db) {
    const citiesRef = ref(db, 'test');
    const citySnapshot = await get(citiesRef);
    const cityList = [];
    citySnapshot.forEach(childSnapshot => {
        cityList.push(childSnapshot.val());
    });
    return cityList;
}

// Initialize Express app
const app = express();
app.use(cors());
const port = 4000;

// Endpoint to fetch data from Realtime Database
app.get('/stats', async (req, res) => {
    try {
        const cityList = await getStats(db);
        res.json(cityList);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send('An error occurred while fetching data');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});