



const { google } = require('googleapis');
const express = require('express');


const CLIENT_ID = "46328295376-j1uktc1n2ktdmksdf7oec582q1tgc91b.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = 'http://localhost:4000';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const app = express();

app.get('/auth', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube.upload'],
  });

  res.redirect(authUrl);
});

app.get('/', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.send('No code provided');
  }

  const { tokens } = await oauth2Client.getToken(code);
  console.log('Tokens:', tokens);
  res.send('Tokens received! Check your console.');
});

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
  console.log('Visit http://localhost:4000/auth to start the flow');
});
