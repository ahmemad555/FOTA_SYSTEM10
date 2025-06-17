const { google } = require('googleapis');
const stream = require('stream');

async function uploadVideo(fileBuffer, title, description) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });

  const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client
  });

  const passthroughStream = new stream.PassThrough();
  passthroughStream.end(fileBuffer);

  const response = await youtube.videos.insert({
    part: 'snippet,status',
    requestBody: {
      snippet: { title, description },
      status: { privacyStatus: 'private' }
    },
    media: { body: passthroughStream }
  });

  return response.data.id; // YouTube videoId
}


module.exports={
    uploadVideo
}
