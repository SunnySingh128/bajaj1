const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const CHITKARA_EMAIL = "YOUR_CHITKARA_EMAIL@chitkara.edu.in"; // Replace with your actual email

// --- Helper Functions ---

// 1. Fibonacci Series
const getFibonacci = (n) => {
    let series = [0, 1];
    for (let i = 2; i < n; i++) {
        series.push(series[i - 1] + series[i - 2]);
    }
    return series.slice(0, n);
};

// 2. Prime Numbers
const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

// 3. HCF & LCM
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const findHCF = (arr) => arr.reduce((acc, val) => gcd(acc, val));
const findLCM = (arr) => arr.reduce((acc, val) => (acc * val) / gcd(acc, val));

// --- Endpoints ---

// GET /health - Requirement: is_success and official email
app.get('/health', (req, res) => {
    res.status(200).json({
        "is_success": true,
        "official_email": process.env.CHITKARA_EMAIL
    });
});

// POST /bfhl - Requirement: Single functional key logic
app.post('/bfhl', async (req, res) => {
    try {
        const { fibonacci, prime, lcm, hcf, AI } = req.body;
        let responseData;

        // Logic Mapping as per document
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
            // Google Gemini Integration
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `${AI}. Respond with only one word.`;
            const result = await model.generateContent(prompt);
            responseData = result.response.text().trim();
        } 
        else {
            return res.status(400).json({ 
                "is_success": false, 
                "message": "Invalid input: Provide one of fibonacci, prime, lcm, hcf, or AI" 
            });
        }

        // Mandatory Response Structure
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