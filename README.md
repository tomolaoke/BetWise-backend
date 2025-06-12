# BetWise: Your Fun Sports Betting Platform 🏆
Welcome to BetWise, a cool sports betting platform where you can bet on football matches with virtual money, just like SportyBet! Think Premier League showdowns like Manchester United vs. Arsenal, with odds, bets, and payouts—all in Nigerian Naira (₦) for our Nigerian users. This is the backend, built with Node.js, Express, and MongoDB, making it fast and reliable. Whether you're a beginner or a pro, this guide will walk you through setting it up and testing it like a champ!

## What’s BetWise All About?
Imagine you’re at a stadium, betting on your favorite teams with virtual cash. Here’s how it works:

- Admins create matches (e.g., Manchester United vs. Arsenal) and set odds (like 2.0 for a win).
- Users sign up, fund their virtual wallet, place bets (e.g., ₦1000 on Manchester United to win), and withdraw winnings.
- Results are set by admins, bets are settled (win or lose), and winners get payouts credited to their wallets.
- Wallet shows your balance in ₦ if you’re from Nigeria, or $ for others.

This backend powers it all with APIs (think of them as messengers) that let users sign up, bet, and check their winnings.

## Prerequisites: What You Need
Before we kick off, make sure you have these tools:

- Node.js (v20.17.0 or later): It’s like the engine for our app. Download it.
- MongoDB: Our database to store games, bets, and wallets. Use MongoDB Atlas or install locally here.
- Postman: A tool to test our APIs. Get it.
- Git: To grab the code. Install it.
- A computer and some excitement to build a betting app!

## Setup: Get BetWise Running
Follow these steps to set up the backend. It’s like setting up a game console—easy peasy!

### Clone the Project:
Open a terminal (or Command Prompt) and run:
```bash
git clone https://github.com/yourusername/betwise-backend.git
cd betwise-backend
```
This downloads the code to your computer.

### Install Dependencies:
Run this to get all the tools the app needs:
```bash
npm install
```
It’s like downloading game updates—it might take a minute! This installs express, mongoose, cors, morgan, bcryptjs, jsonwebtoken, express-validator, and express-async-handler.

### Set Up Environment Variables:
Create a file called `.env` in the `betwise-backend` folder and add:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/betwise?retryWrites=true&w=majority
JWT_SECRET=supersecretbetwise
PORT=5000
```
- `MONGODB_URI`: Your MongoDB Atlas connection string or `mongodb://localhost:27017/betwise` for local.
- `JWT_SECRET`: A secret code for user logins (make it unique!).
- `PORT`: Where the app runs (5000 is fine).

### Start MongoDB:
If using local MongoDB, run in a terminal:
```bash
mongod
```
If it’s running, you’ll see logs. For MongoDB Atlas, ensure your cluster is active. Keep the terminal open for local MongoDB.

### Start the Server:
In another terminal, in the `betwise-backend` folder, run:
```bash
npm start
```
You should see:
```
MongoDB connected—ready to bet!
Best Wishes! - Tomola Oke (CareerEx Cohort3)
Server running on port 5000—let’s bet!
```
Your backend is now live at `http://localhost:5000`!

---
# POSTMAN DOCUMENTATION URL: 

https://documenter.getpostman.com/view/37688262/2sB2x6kXFe

## Testing with Postman: (Examples)
Now, let’s test all the APIs using Postman to make sure everything works. Open Postman and set the base URL to `http://localhost:5000`. Each test below shows the request, JSON, and what to expect. Follow these like a playbook!

### Before You Start
- **Get Postman Ready**: Create a new collection called “BetWise” in Postman to organize your requests.
- **Admin Setup**: Some endpoints (like creating games) need an admin user. We’ll set one up in the tests.
- **Tokens**: For protected endpoints, you’ll need a JWT token. We’ll get these from login.
- **Wallet Funds**: We’ll add virtual ₦ via an API to test betting.

### 1. Register a User
Create a new user to start betting.

- **Request**: POST `http://localhost:5000/auth/register`
- **Headers**: `Content-Type: application/json`
- **Body** (JSON):
  ```json
  {
    "name": "Chukwudi Okoye",
    "email": "chukwudi@example.com",
    "password": "chukwudi123456",
    "country": "Nigeria"
  }
  ```
- **Expected Response** (201):
  ```json
  {
    "message": "Welcome, Chukwudi Okoye! Your account is ready—time to bet!",
    "user": {
      "_id": "<user_id>",
      "name": "Chukwudi Okoye",
      "email": "chukwudi@example.com",
      "country": "Nigeria",
      "isAdmin": false,
      "wallet": 150
    },
    "token": "<user_token>"
  }
  ```
- **Check**:
  - Status is 201.
  - Copy the token (user token) and _id (e.g., 68384044600795eec9b1518c) for later.
  - The user is saved with a ₦150 wallet.

### 2. Log In
Log in to get a fresh token (in case the old one expires).

- **Request**: POST `http://localhost:5000/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body** (JSON):
  ```json
  {
    "email": "chukwudi@example.com",
    "password": "chukwudi123456"
  }
  ```
- **Expected Response** (200):
  ```json
  {
    "message": "Welcome back, Chukwudi Okoye! Let’s get betting!",
    "user": {
      "_id": "<user_id>",
      "name": "Chukwudi Okoye",
      "email": "chukwudi@example.com",
      "country": "Nigeria",
      "isAdmin": false,
      "wallet": 150
    },
    "token": "<user_token>"
  }
  ```
- **Check**:
  - Status is 200.
  - Copy the token for user actions (e.g., betting).

### 3. Create an Admin User
We need an admin to create games and set results.

- **Register Admin**:
  - **Request**: POST `http://localhost:5000/auth/register`
  - **Body**:
    ```json
    {
      "name": "Betwise Admin",
      "email": "admin@example.com",
      "password": "admin123456",
      "country": "Nigeria"
    }
    ```
- **Make Admin**:
  - Open MongoDB (e.g., via MongoDB Compass or `mongo` shell).
  - Run:
    ```javascript
    use betwise;
    db.users.updateOne(
      { email: "admin@example.com" },
      { $set: { isAdmin: true } }
    );
    ```
- **Log In as Admin**:
  - **Request**: POST `http://localhost:5000/auth/login`
  - **Body**:
    ```json
    {
      "email": "admin@example.com",
      "password": "admin123456"
    }
    ```
  - **Expected Response** (200):
    ```json
    {
      "message": "Welcome back, Betwise Admin! Let’s get betting!",
      "user": {
        "_id": "<admin_id>",
        "name": "Betwise Admin",
        "email": "admin@example.com",
        "country": "Nigeria",
        "isAdmin": true,
        "wallet": 150
      },
      "token": "<admin_token>"
    }
    ```
  - Copy the `token` (admin token).

### 4. Create a Game (Admin)
Admins create matches for betting.

- **Request**: POST `http://localhost:5000/games`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <admin_token>`
- **Body** (JSON):
  ```json
  {
    "homeTeam": "Manchester United",
    "awayTeam": "Arsenal",
    "odds": {
      "home": 2.0,
      "away": 3.5,
      "draw": 3.0
    },
    "league": "Premier League",
    "matchDate": "2025-06-15T15:00:00Z"
  }
  ```
- **Expected Response** (201):
  ```json
  {
    "message": "Match added! Manchester United vs Arsenal is ready for bets!",
    "game": {
      "_id": "<game_id>",
      "homeTeam": "Manchester United",
      "awayTeam": "Arsenal",
      "odds": {
        "home": 2,
        "away": 3.5,
        "draw": 3
      },
      "league": "Premier League",
      "matchDate": "2025-06-15T15:00:00.000Z",
      "createdAt": "<timestamp>",
      "result": null
    }
  }
  ```
- **Check**:
  - Status is 201.
  - Copy the game._id (e.g., 6838b41ac8ea7cca8415dfd0) for betting and setting results.

### 5. Get All Games
See all matches available for betting.

- **Request**: GET `http://localhost:5000/games`
- **Headers**: None (public endpoint)
- **Expected Response** (200):
  ```json
  {
    "message": "Here’s the lineup of matches to bet on!",
    "games": [
      {
        "_id": "<game_id>",
        "homeTeam": "Manchester United",
        "awayTeam": "Arsenal",
        "odds": {
          "home": 2,
          "away": 3.5,
          "draw": 3
        },
        "league": "Premier League",
        "matchDate": "2025-06-15T15:00:00.000Z",
        "createdAt": "<timestamp>",
        "result": null
      }
    ]
  }
  ```
- **Check**:
  - Status is 200.
  - Games are listed, including the Manchester United vs. Arsenal match.

### 6. Fund User’s Wallet
To place bets, the user needs virtual ₦ in their wallet.

- **Request**: POST `http://localhost:5000/wallet/deposit`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <user_token>`
- **Body** (JSON):
  ```json
  {
    "amount": 3000
  }
  ```
- **Expected Response** (200):
  ```json
  {
    "message": "Wallet funded with ₦3000—ready to bet!",
    "balance": "₦3150"
  }
  ```
- **Check**:
  - Status is 200.
  - Balance is ₦3150 (₦150 initial + ₦3000).

### 7. Place a Bet
Bet on a match (e.g., Manchester United to win).

- **Request**: POST `http://localhost:5000/bets`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <user_token>`
- **Body** (JSON):
  ```json
  {
    "gameId": "<game_id>",
    "outcome": "home",
    "stake": 1000
  }
  ```
- **Expected Response** (201):
  ```json
  {
    "message": "Bet placed successfully! Good luck on Manchester United vs Arsenal!",
    "bet": {
      "_id": "<bet_id>",
      "user": "<user_id>",
      "game": "<game_id>",
      "outcome": "home",
      "stake": "₦1000",
      "payout": "₦2000",
      "status": "pending",
      "createdAt": "<timestamp>",
      "updatedAt": "<timestamp>"
    }
  }
  ```
- **Check**:
  - Status is 201.
  - stake is ₦1000, payout is ₦2000 (1000 × 2.0 odds).
  - In MongoDB, check users collection: Chukwudi’s wallet is now 2150 (3150 - 1000).

### 8. Get Your Bets
See all your bets.

- **Request**: GET `http://localhost:5000/bets`
- **Headers**: `Authorization: Bearer <user_token>`
- **Expected Response** (200):
  ```json
  {
    "message": "Here’s your betting history—check your wins!",
    "bets": [
      {
        "_id": "<bet_id>",
        "user": "<user_id>",
        "game": {
          "_id": "<game_id>",
          "homeTeam": "Manchester United",
          "awayTeam": "Arsenal",
          "odds": {
            "home": 2,
            "away": 3.5,
            "draw": 3
          },
          "league": "Premier League",
          "matchDate": "2025-06-15T15:00:00.000Z",
          "createdAt": "<timestamp>",
          "result": null
        },
        "outcome": "home",
        "stake": "₦1000",
        "payout": "₦2000",
        "status": "pending",
        "createdAt": "<timestamp>",
        "updatedAt": "<timestamp>"
      }
    ]
  }
  ```
- **Check**:
  - Status is 200.
  - Bet is listed with ₦ formatting for Nigerian users.

### 9. Set Game Result (Admin)
Set the match result to determine winners and settle bets.

- **Request**: PATCH `http://localhost:5000/games/<game_id>/result`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <admin_token>`
- **Body** (JSON):
  ```json
  {
    "result": "home"
  }
  ```
- **Expected Response** (200):
  ```json
  {
    "message": "Result set for Manchester United vs Arsenal!",
    "game": {
      "_id": "<game_id>",
      "homeTeam": "Manchester United",
      "awayTeam": "Arsenal",
      "odds": {
        "home": 2,
        "away": 3.5,
        "draw": 3
      },
      "result": "home - Manchester United Wins!",
      "league": "Premier League",
      "matchDate": "2025-06-15T15:00:00.000Z",
      "createdAt": "<timestamp>"
    }
  }
  ```
- **Check**:
  - Status is 200.
  - In MongoDB, check games collection: result is "home".
  - Check bets collection:
    ```js
    db.bets.findOne({ _id: ObjectId("<bet_id>") });
    ```
    Expect: status: "won".
  - Check users collection:
    ```js
    db.users.findOne({ _id: ObjectId("<user_id>") });
    ```
    Expect: wallet: 4150 (2150 + 2000 payout).

### 10. Check Wallet
See your virtual balance.

- **Request**: GET `http://localhost:5000/wallet`
- **Headers**: `Authorization: Bearer <user_token>`
- **Expected Response** (200):
  ```json
  {
    "message": "Your wallet balance is ready!",
    "balance": "₦4150",
    "country": "Nigeria"
  }
  ```
- **Check**:
  - Status is 200.
  - Balance is ₦4150 after the ₦1000 bet and ₦2000 payout.

---

## Troubleshooting: If Things Go Wrong

- **Server Won’t Start**: Check if MongoDB is running (`mongod` for local or Atlas cluster active) and `.env` is set correctly.
- **Token Errors**: Re-login to get a fresh token. Ensure `Authorization: Bearer <token>` is set in Postman.
- **Game Not Found**: Use `GET /games` to find a valid `gameId`. Create a new game if needed.
- **Not Enough Funds**: Fund the wallet via `POST /wallet/deposit` or update in MongoDB:
  ```js
  db.users.updateOne(
    { email: "chukwudi@example.com" },
    { $set: { wallet: 3150 } }
  );
  ```
- **Admin Access**: Ensure the admin user has `isAdmin: true` in MongoDB:
  ```js
  db.users.findOne({ email: "admin@example.com" });
  ```
- **Bet Not Settled**: Reset game and bet for retesting:
  ```js
  db.games.updateOne(
    { _id: ObjectId("<game_id>") },
    { $set: { result: null } }
  );
  db.bets.updateOne(
    { _id: ObjectId("<bet_id>") },
    { $set: { status: "pending" } }
  );
  db.users.updateOne(
    { _id: ObjectId("<user_id>") },
    { $set: { wallet: 2150 } }
  );
  ```

## Author : Made with passion ❤️ Tomola Oke (CareerEX)
