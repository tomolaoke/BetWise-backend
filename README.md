# BetWise: Your Fun Sports Betting Platform 🏆

Welcome to **BetWise**, a cool sports betting platform where you can bet on football matches with virtual money, just like SportyBet! Think Premier League showdowns like Liverpool vs. Chelsea, with odds, bets, and payouts—all in Nigerian Naira (₦) for our Nigerian users. This is the backend, built with Node.js, Express, and MongoDB, making it fast and reliable. Whether you're a beginner or a pro, this guide will walk you through setting it up and testing it like a champ!

## What’s BetWise All About?

Imagine you’re at a stadium, betting on your favorite teams with virtual cash. Here’s how it works:
- **Admins** create matches (e.g., Manchester City vs. Tottenham) and set odds (like 2.0 for a win).
- **Users** sign up, get a virtual wallet, and place bets (e.g., ₦1000 on Liverpool to win).
- **Results** are set by admins, and winners get payouts (coming soon!).
- **Wallet** shows your balance in ₦ if you’re from Nigeria, or $ for others.

This backend powers it all with APIs (think of them as messengers) that let users sign up, bet, and check their winnings.

## Prerequisites: What You Need

Before we kick off, make sure you have these tools:
- **Node.js** (v14 or later): It’s like the engine for our app. [Download it](https://nodejs.org).
- **MongoDB**: Our database to store games and bets. [Install it](https://www.mongodb.com/try/download/community).
- **Postman**: A tool to test our APIs. [Get it](https://www.postman.com/downloads).
- **Git**: To grab the code. [Install it](https://git-scm.com).
- A computer and some excitement to build a betting app!

## Setup: Get BetWise Running

Follow these steps to set up the backend. It’s like setting up a game console—easy peasy!

1. **Clone the Project**:
   Open a terminal (or Command Prompt) and run:
   ```bash
   git clone https://github.com/yourusername/betwise-backend.git
   cd betwise-backend
   ```
   This downloads the code to your computer.

2. **Install Dependencies**:
   Run this to get all the tools the app needs:
   ```bash
   npm install
   ```
   It’s like downloading game updates—it might take a minute!

3. **Set Up Environment Variables**:
   Create a file called `.env` in the `betwise-backend` folder and add:
   ```bash
   MONGODB_URI=mongodb://localhost:27017/betwise
   JWT_SECRET=supersecretkey123
   PORT=5000
   ```
   - `MONGODB_URI`: Where the database lives.
   - `JWT_SECRET`: A secret code for user logins (make it unique!).
   - `PORT`: Where the app runs (5000 is fine).


4. **Start MongoDB**:
   Make sure MongoDB is running. In a terminal, run:
   ```bash
   mongod
   ```
   If it’s running, you’ll see some logs. Keep this terminal open.

5. **Start the Server**:
   In another terminal, in the `betwise-backend` folder, run:
   ```bash
   npm start
   ```
   You should see:
   ```
   Server running on port 5000—let’s bet!
   MongoDB connected—ready to store games and bets!
   ```
   Your backend is now live at `http://localhost:5000`!

## Testing with Postman: Be the Referee!

Now, let’s test all the APIs using **Postman** to make sure everything works. Open Postman and set the base URL to `http://localhost:5000`. Each test below shows the request, JSON, and what to expect. Follow these like a playbook!

### Before You Start
- **Get Postman Ready**: Create a new collection called “BetWise” in Postman to organize your requests.
- **Admin Setup**: Some endpoints (like creating games) need an admin user. We’ll set one up in the tests.
- **Tokens**: For protected endpoints, you’ll need a JWT token. We’ll get these from login.
- **Wallet Funds**: We’ll add virtual ₦ to test betting.

### 1. Register a User
Create a new user to start betting.

- **Request**: POST `http://localhost:5000/auth/register`
- **Headers**: `Content-Type: application/json`
- **Body** (JSON):
  ```json
  {
    "name": "Chidi",
    "email": "chidi@example.com",
    "password": "bet123456",
    "country": "Nigeria"
  }
  ```
- **Expected Response** (201):
  ```json
  {
    "token": "<jwt_token>"
  }
  ```
- **Check**:
  - Status is 201.
  - Copy the `token` for later (this is your user token).
  - The user is saved with a ₦0 wallet.

### 2. Log In
Log in to get a fresh token (in case the old one expires).

- **Request**: POST `http://localhost:5000/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body** (JSON):
  ```json
  {
    "email": "chidi@example.com",
    "password": "bet123456"
  }
  ```
- **Expected Response** (200):
  ```json
  {
    "token": "<jwt_token>"
  }
  ```
- **Check**:
  - Status is 200.
  - Copy the `token` for user actions (e.g., betting).

### 3. Create an Admin User
We need an admin to create games and set results.

- **Register Admin**:
  - **Request**: POST `http://localhost:5000/auth/register`
  - **Body**:
    ```json
    {
      "name": "Admin",
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
  - Copy the `token` (this is your admin token).

### 4. Create a Game (Admin)
Admins create matches for betting.

- **Request**: POST `http://localhost:5000/games`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <admin_token>`
- **Body** (JSON):
  ```json
  {
    "homeTeam": "Liverpool",
    "awayTeam": "Chelsea",
    "odds": {
      "home": 2.0,
      "away": 3.2,
      "draw": 2.9
    },
    "league": "Premier League",
    "matchDate": "2025-05-21T16:00:00Z"
  }
  ```
- **Expected Response** (201):
  ```json
  {
    "message": "Match added! Liverpool vs Chelsea is ready for bets!",
    "game": {
      "_id": "<game_id>",
      "homeTeam": "Liverpool",
      "awayTeam": "Chelsea",
      "odds": {
        "home": 2,
        "away": 3.2,
        "draw": 2.9
      },
      "league": "Premier League",
      "matchDate": "2025-05-21T16:00:00.000Z",
      ...
    }
  }
  ```
- **Check**:
  - Status is 201.
  - Copy the `game._id` (e.g., `6826680e174841f80e87d466`) for betting and setting results.

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
        "homeTeam": "Liverpool",
        "awayTeam": "Chelsea",
        ...
      }
    ]
  }
  ```
- **Check**:
  - Status is 200.
  - Games are listed, including the Liverpool vs. Chelsea match.

### 6. Fund User’s Wallet
To place bets, the user needs virtual ₦ in their wallet.

- In MongoDB, add ₦5000 to Chidi’s wallet:
  ```javascript
  use betwise;
  db.users.updateOne(
    { email: "chidi@example.com" },
    { $set: { wallet: 5000 } }
  );
  ```

### 7. Place a Bet
Bet on a match (e.g., Liverpool to win).

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
    "message": "Bet placed successfully! Good luck on Liverpool vs Chelsea!",
    "bet": {
      "_id": "<bet_id>",
      "user": "<user_id>",
      "game": "<game_id>",
      "outcome": "home",
      "stake": "₦1000",
      "payout": "₦2000",
      "status": "pending",
      ...
    }
  }
  ```
- **Check**:
  - Status is 201.
  - `stake` is `₦1000`, `payout` is `₦2000` (1000 × 2.0 odds).
  - In MongoDB, check `users` collection: Chidi’s `wallet` is now `4000` (5000 - 1000).

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
        "outcome": "home",
        "stake": "₦1000",
        "payout": "₦2000",
        "status": "pending",
        "game": {
          "_id": "<game_id>",
          "homeTeam": "Liverpool",
          "awayTeam": "Chelsea",
          ...
        },
        ...
      }
    ]
  }
  ```
- **Check**:
  - Status is 200.
  - Bet is listed with `₦` formatting for Nigerian users.

### 9. Set Game Result (Admin)
Set the match result to determine winners (payout logic not yet implemented).

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
    "message": "Result set for Liverpool vs Chelsea!",
    "game": {
      "_id": "<game_id>",
      "homeTeam": "Liverpool",
      "awayTeam": "Chelsea",
      "result": "home",
      ...
    }
  }
  ```
- **Check**:
  - Status is 200.
  - In MongoDB, check `games` collection: `result` is `"home"`.

### 10. Check Wallet
See your virtual balance.

- **Request**: GET `http://localhost:5000/wallet`
- **Headers**: `Authorization: Bearer <user_token>`
- **Expected Response** (200):
  ```json
  {
    "message": "Your wallet balance is ready!",
    "balance": "₦4000",
    "country": "Nigeria"
  }
  ```
- **Check**:
  - Status is 200.
  - Balance is `₦4000` after the ₦1000 bet.

## Troubleshooting: If Things Go Wrong

- **Server Won’t Start**: Check if MongoDB is running (`mongod`) and `.env` is set correctly.
- **Token Errors**: Re-login to get a fresh token. Ensure `Authorization: Bearer <token>` is set in Postman.
- **Game Not Found**: Use `GET /games` to find a valid `gameId`. Create a new game if needed.
- **Not Enough Funds**: Update the user’s `wallet` in MongoDB (e.g., `db.users.updateOne(...)`).
- **Admin Access**: Ensure the admin user has `isAdmin: true` in MongoDB.

## Author : Tomola Oke (CareerEX)
