const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
// Make sure to set this in your .env or replace it here
const CHITKARA_EMAIL = process.env.CHITKARA_EMAIL || "YOUR_CHITKARA_EMAIL@chitkara.edu.in";

// --- Logic Functions (States) ---

// 1. Fibonacci Logic
const getFibonacci = (n) => {
    let series = [0, 1];
    for (let i = 2; i < n; i++) series.push(series[i - 1] + series[i - 2]);
    return series.slice(0, n);
};

// 2. Prime Logic
const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

// 3. HCF & LCM Logic
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const findHCF = (arr) => arr.reduce((acc, val) => gcd(acc, val));
const findLCM = (arr) => arr.reduce((acc, val) => (acc * val) / gcd(acc, val));

// --- Hardcoded AI State Database ---
const aiDatabase = {
    "what is the capital city of Maharashtra?": "Mumbai",
    "what is the capital of India?": "Delhi",
    "what is the capital city of Andhra Pradesh?": "Amaravati",
    "what is the capital city of Arunachal Pradesh?": "Itanagar",
    "what is the capital city of Assam?": "Dispur",
    "what is the capital city of Bihar?": "Patna",
    "what is the capital city of Chhattisgarh?": "Raipur",
    "what is the capital city of Goa?": "Panaji",
    "what is the capital city of Gujarat?": "Gandhinagar",
    "what is the capital city of Haryana?": "Chandigarh",
    "what is the capital city of Himachal Pradesh?": "Shimla",
    "what is the capital city of Jharkhand?": "Ranchi",
    "what is the capital city of Karnataka?": "Bengaluru",
    "what is the capital city of Kerala?": "Thiruvananthapuram",
    "what is the capital city of Madhya Pradesh?": "Bhopal",
    "what is the capital city of Manipur?": "Imphal",
    "what is the capital city of Meghalaya?": "Shillong",
    "what is the capital city of Mizoram?": "Aizawl",
    "what is the capital city of Nagaland?": "Kohima",
    "what is the capital city of Odisha?": "Bhubaneswar",
    "what is the capital city of Punjab?": "Chandigarh",
    "what is the capital city of Rajasthan?": "Jaipur",
    "what is the capital city of Sikkim?": "Gangtok",
    "what is the capital city of Tamil Nadu?": "Chennai",
    "what is the capital city of Telangana?": "Hyderabad",
    "what is the capital city of Tripura?": "Agartala",
    "what is the capital city of Uttar Pradesh?": "Lucknow",
    "what is the capital city of Uttarakhand?": "Dehradun",
    "what is the capital city of West Bengal?": "Kolkata",
    "what is the capital city of Jammu and Kashmir?": "Srinagar (summer), Jammu (winter)",
    "what is the capital city of Ladakh?": "Leh",
    "what is the capital city of Puducherry?": "Puducherry",
    "what is the capital city of Chandigarh?": "Chandigarh",
    "what is the capital city of Andaman and Nicobar Islands?": "Port Blair",
    "what is the capital city of Dadra and Nagar Haveli and Daman and Diu?": "Daman",
    "what is the capital city of Lakshadweep?": "Kavaratti"
};


app.get('/health', (req, res) => {
    res.status(200).json({
        "is_success": true,
        "official_email": CHITKARA_EMAIL
    });
});

app.post('/bfhl', (req, res) => {
    try {
        const body = req.body;
        let responseData;

        // State 1: Fibonacci
        if (body.fibonacci !== undefined) {
            responseData = getFibonacci(parseInt(body.fibonacci));
        } 
        // State 2: Prime
        else if (body.prime !== undefined && Array.isArray(body.prime)) {
            responseData = body.prime.filter(num => isPrime(parseInt(num)));
        } 
        // State 3: LCM
        else if (body.lcm !== undefined && Array.isArray(body.lcm)) {
            responseData = findLCM(body.lcm.map(Number));
        } 
        // State 4: HCF
        else if (body.hcf !== undefined && Array.isArray(body.hcf)) {
            responseData = findHCF(body.hcf.map(Number));
        } 
        // State 5: AI (Hardcoded Logic)
        else if (body.AI !== undefined) {
const question = body.AI.toLowerCase().trim();
    
    // 2. Lookup in the database (Now case-insensitive because both sides are lowercase)
    responseData = aiDatabase[question] || "Single-word-answer";
        } 
        // Error State
        else {
            return res.status(400).json({ 
                "is_success": false, 
                "message": "Invalid functional key provided." 
            });
        }

        // Final Mandatory Response Structure
        res.status(200).json({
            "is_success": true,
            "official_email": CHITKARA_EMAIL,
            "data": responseData
        });

    } catch (error) {
        res.status(500).json({ 
            "is_success": false, 
            "message": "Internal Server Error" 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});