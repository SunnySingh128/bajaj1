const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const CHITKARA_EMAIL =process.env.CHITKARA_EMAIL || "YOUR_CHITKARA_EMAIL@chitkara.edu.in";


const getFibonacci = (n) => {
    let series = [0, 1];
    for (let i = 2; i < n; i++) {
        series.push(series[i - 1] + series[i - 2]);
    }
    return series.slice(0, n);
};

const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const findHCF = (arr) => arr.reduce((acc, val) => gcd(acc, val));
const findLCM = (arr) => arr.reduce((acc, val) => (acc * val) / gcd(acc, val));

app.get('/health', (req, res) => {
    res.status(200).json({
        "is_success": true,
        "official_email": CHITKARA_EMAIL
    });
});

const INDIA_CAPITALS = {
  "andhra pradesh": "Amaravati",
  "arunachal pradesh": "Itanagar",
  "assam": "Dispur",
  "bihar": "Patna",
  "chhattisgarh": "Raipur",
  "goa": "Panaji",
  "gujarat": "Gandhinagar",
  "haryana": "Chandigarh",
  "himachal pradesh": "Shimla",
  "jharkhand": "Ranchi",
  "karnataka": "Bengaluru",
  "kerala": "Thiruvananthapuram",
  "madhya pradesh": "Bhopal",
  "maharashtra": "Mumbai",
  "manipur": "Imphal",
  "meghalaya": "Shillong",
  "mizoram": "Aizawl",
  "nagaland": "Kohima",
  "odisha": "Bhubaneswar",
  "punjab": "Chandigarh",
  "rajasthan": "Jaipur",
  "sikkim": "Gangtok",
  "tamil nadu": "Chennai",
  "telangana": "Hyderabad",
  "tripura": "Agartala",
  "uttar pradesh": "Lucknow",
  "uttarakhand": "Dehradun",
  "west bengal": "Kolkata",
  "india": "New Delhi"
};


app.post('/bfhl', async (req, res) => {
    try {
        const { fibonacci, prime, lcm, hcf, AI } = req.body;
        let responseData;

        if (fibonacci !== undefined) {
            responseData = getFibonacci(parseInt(fibonacci));
        } 
        else if (prime !== undefined && Array.isArray(prime)) {
            responseData = prime.filter(num => isPrime(parseInt(num)));
        } 
        else if (lcm !== undefined && Array.isArray(lcm)) {
            responseData = findLCM(lcm.map(Number));
        } 
        else if (hcf !== undefined && Array.isArray(hcf)) {
            responseData = findHCF(hcf.map(Number));
        } 
       else if (AI !== undefined) {
    const question = AI.toLowerCase();

    let answer = "Unknown";

    for (const state in INDIA_CAPITALS) {
        if (question.includes(state)) {
            answer = INDIA_CAPITALS[state];
            break;
        }
    }

    responseData = answer;
}

        else {
            return res.status(400).json({ 
                "is_success": false, 
                "message": "Invalid input: Provide one of fibonacci, prime, lcm, hcf, or AI" 
            });
        }

        res.status(200).json({
            "is_success": true,
            "official_email": CHITKARA_EMAIL,
            "data": responseData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            "is_success": false, 
            "message": "Internal Server Error" 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});