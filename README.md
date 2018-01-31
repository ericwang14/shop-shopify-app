This is SHOP.COM shopify sales channel app.

Running Step:

1. go to root folder and open command line window.
2. type in ngrok http 3000, you should able to seeing the ngrok success started and listen to the 3000 port.
3. go to shopify-express-application.
4. open "index.js" file change {replaceme} to the domain you seeing in the ngrok window.
        from const forwardingAddress = "https://{replaceme}.ngrok.io";
        to const forwardingAddress = "https://14bffbbc.ngrok.io";

5. open browser and hit https://14bffbbc.ngrok.io/shopify?shop=alexteststorenow.myshopify.com, replace 14bffbbc same as #4.
