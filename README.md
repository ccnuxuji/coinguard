# CoinGuard
[>>>Live Site<<<](https://coinguard.onrender.com)

CoinGuard is a web application inspired by the popular stock exchange website, Robinhood. It empowers users to create their own stock exchange accounts, granting them access to real-time stock data and the ability to engage in buying and selling stocks. Additionally, users can curate personalized watchlists to closely monitor various stocks of interest. The application allows users to easily search for stocks by company name or stock symbols.

## Technology used
**Frontend:** JavaScript, Html, CSS, React, Redux

**Backend:** Node.js, Express, Sequelize, PostgreSQL

**Third-party service:** FMP APIs, Finnhub APIs

## Feature Lists

1. Sign up, log in, and demo user 
![db-schema](./images/signup-login.gif)

2. View stock details, buy and sell stock

3. Create customized watchlist

4. Search stocks

## Contact me

Jimmy Xu, ccnuxuji@gmail.com, [Linkedin](https://www.linkedin.com/in/ccnuxuji/)

## Getting started
1. Clone this repository:

   `
   https://github.com/ccnuxuji/coinguard.git
   `
2. Install denpendencies into the Backed and the Frontend by making a terminal for each one and then run the following:

   * `npm install`

3. Create a **.env** file using the **.envexample** provided 

4. Set up your database with information from your .env and then run the following to create your database, migrate, and seed: 
 
   * `npx dotenv sequelize db:create`
   * `npx dotenv sequelize db:migrate` 
   * `npx dotenv sequelize db:seed:all`

5. Start the app for both backend and frontend using:

   * `npm start`

6. Now you can use the Demo User or Create an account