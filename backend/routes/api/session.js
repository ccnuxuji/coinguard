const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { setTokenCookie } = require('../../utils/auth');
const { User, Portfolio } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { OAuth2Client } = require('google-auth-library');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


const router = express.Router();

const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a password.'),
    handleValidationErrors
];

/* GET users listing. */
router.post('/googleauth', async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header("Referrer-Policy", "no-referrer-when-downgrade");
    let redirectURL = 'http://localhost:8001/api/session/oauth';
    if (process.env.NODE_ENV === "production") {
        redirectURL = "https://coinguard.onrender.com/api/session/oauth"
    }


    const oAuth2Client = new OAuth2Client(
        process.env.GOOGLE_AUTH_CLIENT_ID,
        process.env.GOOGLE_AUTH_CLIENT_SECRET,
        redirectURL
    );

    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile  openid ',
        prompt: 'consent'
    });

    res.json({ url: authorizeUrl })

});

async function getUserData(res, access_token, expiry_date) {

    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);

    const data = await response.json();
    console.log('data', data);
    // search if the current exists
    let user = await User.findOne({
        where: {
            username: data.sub
        }
    });
    
    if (!user) {
        user = await User.create({ email:  `${data.sub}@example.com`, username:  data.sub, hashedPassword: "111111", firstName: data.given_name, lastName: data.family_name });
        await Portfolio.create({userId:user.id, cashValue: 0});
    }

    res.cookie('token', access_token, {
        exp: expiry_date,
        httpOnly: true,
        secure: true,
        sameSite: "Lax"
    });

    return user;
}


/* GET home page. */
router.get('/oauth', async function (req, res, next) {

    const code = req.query.code;
    let user1;

    console.log(code);
    try {
        let redirectURL = "http://localhost:8001/api/session/oauth"
        if (process.env.NODE_ENV === "production") {
            redirectURL = "https://coinguard.onrender.com/api/session/oauth"
        }
        const oAuth2Client = new OAuth2Client(
            process.env.GOOGLE_AUTH_CLIENT_ID,
            process.env.GOOGLE_AUTH_CLIENT_SECRET,
            redirectURL
        );
        const r = await oAuth2Client.getToken(code);
        // Make sure to set the credentials on the OAuth2 client.
        await oAuth2Client.setCredentials(r.tokens);
        console.info('Tokens acquired.');
        const user = oAuth2Client.credentials;
        console.log('credentials', user);
        user1 = await getUserData(res, oAuth2Client.credentials.access_token, oAuth2Client.credentials.expiry_date);

    } catch (err) {
        console.log('Error logging in with OAuth2 user', err);
    }


    res.redirect(303, process.env.NODE_ENV === "production" ? "https://coinguard.onrender.com/portfolio" : "http://localhost:3000/portfolio");

});



// Log in
router.post(
    '/',
    validateLogin,
    async (req, res, next) => {
        const { credential, password } = req.body;

        const user = await User.unscoped().findOne({
            where: {
                [Op.or]: {
                    username: credential,
                    email: credential
                }
            }
        });

        if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
            const err = new Error('Login failed');
            err.status = 401;
            err.title = 'Login failed';
            err.errors = { credential: 'The provided credentials were invalid.' };
            return next(err);
        }

        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
        };

        await setTokenCookie(res, safeUser);

        return res.json({
            user: safeUser
        });
    }
);

// Log out
router.delete(
    '/',
    (_req, res) => {
        res.clearCookie('token');
        return res.json({ message: 'success' });
    }
);

// Restore session user
router.get(
    '/',
    (req, res) => {
        console.log("111111111111111111111111111111111111")
        const { user } = req;
        console.log(user);
        if (user) {
            const safeUser = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
            };
            return res.json({
                user: safeUser
            });
        } else return res.json({ user: null });
    }
);

module.exports = router;
