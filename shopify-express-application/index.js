const dotenv = require('dotenv').config();
const express =require('express');
const app = express();
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');
const exphbs = require('express-handlebars');

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = 'read_customers,write_customers,read_products, write_products,read_product_listings, read_collection_listings, read_orders, write_orders';
const forwardingAddress = "https://14bffbbc.ngrok.io";

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.send('hello world!');
});

app.get('/shopify', (req, res) => {
    const shop = req.query.shop;
    if (shop) {
        const state = nonce();
        const redirectURL = forwardingAddress + '/shopify/callback';
        const installURL = 'https://' + shop + 
            '/admin/oauth/authorize?client_id=' + apiKey +
            '&scope=' + scopes +
            '&state=' + state + 
            '&redirect_uri=' + redirectURL;

        console.log('state cookie:' + state);
        res.cookie('state', state, {secure: true, sameSite: false});
        res.redirect(installURL);
    } else {
        return res.status(400).send('Missing shop parameter, please add ?shop=your-development-shop.myshopify.com to your request');
    }
});

app.get('/shopify/callback', (req, res) => {
    const {shop, hmac, code, state} = req.query;
    console.log(req.headers);
    console.log("code:" + code);
    const stateCookie = cookie.parse(req.headers.cookie).state;

    if (state !== stateCookie) {
        return res.status(403).send('Request origin cannot be verified');
    }

    if (shop && hmac && code) {
        const map = Object.assign({}, req.query);
        delete map['signature'];
        delete map['hmac'];

        const message = querystring.stringify(map);
        const generatedHash = crypto
            .createHmac('sha256', apiSecret)
            .update(message)
            .digest('hex');

        if (generatedHash !== hmac) {
            return res.status(400).send('HMAC validation failed');
        }
        //res.render('home');
        res.redirect('/shopify/connect');

        //res.status(200).send('Callback route');
    } else {
        res.status(400).send('Required parameters missing');
    }
});

app.get('/shopify/connect', (req, res) => {

    console.log('user not connect to mbc yet, redirect to default landing page');
    res.render('home');
});

app.get('/shopify/store/:access_token', (req, res) => {
    console.log('access_token:' + req.params.access_token);
    res.render('home');
});
app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
