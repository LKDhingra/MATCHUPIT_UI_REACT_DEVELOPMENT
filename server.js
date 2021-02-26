const fs = require('fs')
const express = require('express');
const http = require('http')
const https = require('https')
const path = require('path')
const app = express()
const compression = require('compression');

// Certificate
//const privateKey = fs.readFileSync('/etc/letsencrypt/live/matchupit.com/privkey.pem', 'utf8');
//const certificate = fs.readFileSync('/etc/letsencrypt/live/matchupit.com/cert.pem', 'utf8');
//const ca = fs.readFileSync('/etc/letsencrypt/live/matchupit.com/chain.pem', 'utf8');
const godaddy_priv = fs.readFileSync('/etc/ssl/private/godaddy_privkey.pem', 'utf8');
const godaddy_cert = fs.readFileSync('/etc/ssl/certs/godaddy_cert.pem', 'utf8');
const godaddy_ca01 = fs.readFileSync('/etc/ssl/certs/godaddy_bundle/gd_bundle_01.crt', 'utf8');
const godaddy_ca02 = fs.readFileSync('/etc/ssl/certs/godaddy_bundle/gd_bundle_02.crt', 'utf8');
const godaddy_ca03 = fs.readFileSync('/etc/ssl/certs/godaddy_bundle/gd_bundle_03.crt', 'utf8');
const credentials = {
  key: godaddy_priv,
  cert: godaddy_cert,
  ca: [godaddy_ca01, godaddy_ca02, godaddy_ca03]
};

// Enable reverse proxy support in Express. This causes the
// the "X-Forwarded-Proto" header field to be trusted so its
// value can be used to determine the protocol. See 
// http://expressjs.com/api#app-settings for more details.
app.enable('trust proxy');

function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) {
    // don't compress responses with this request header
    return false;
  }
  // fallback to standard filter function
  return compression.filter(req, res);
}
app.use(compression({ filter: shouldCompress, level: 7, threshold : 0 }));

// Add a handler to inspect the req.secure flag (see 
// http://expressjs.com/api#req.secure). This allows us 
// to know whether the request was via http or https.
app.use(function (req, res, next) {
  if (req.secure) {
    // request was via https, so do no special handling
    next();
  } else {

    // request was via http, so redirect to https
    res.redirect('https://' + req.headers.host + req.url);
  }
});

// Allow static files in the /public directory to be served
app.use(express.static(path.join(__dirname, '/build'), { dotfiles: 'allow' }));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'))
})

// Start listening on the port 443
https.createServer(credentials, app).listen(443, '0.0.0.0', function () {
  console.log("443 server is running");
});
// Start listening on the port 80
http.createServer(app).listen(80, '0.0.0.0', function () {
  console.log("80 server is running");
});
//app.listen(80,'0.0.0.0');
