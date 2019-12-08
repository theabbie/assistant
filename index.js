var express = require('express');
var axios = require('axios');
var app = express();
app.use(express.json());

app.post("/*", async function(req,res) {
var magnet = "Welcome";
if (req.body.queryResult.queryText) {
magnet = (await axios("https://typi.tk/?url=https://thepiratebay.org/search/"+req.body.queryResult.queryText+"/0/0/1&sel=a[title='Download this torrent using magnet']&attribs=href&static=true")).data[0].attrib;
}
res.json({
  "fulfillmentText": magnet,
  "fulfillmentMessages": [
        {
          "card": {
            "title": "Movie",
            "subtitle": "Movie",
            "imageUri": "https://theabbie.github.io/files/logo.png",
            "buttons": [
              {
                "text": "Movie",
                "postback": "https://theabbie.github.io"
              }
            ]
          }
        }
      ],
  "payload": {
    "google": {
      "expectUserResponse": true,
      "richResponse": {
        "items": [
          {
            "simpleResponse": {
              "textToSpeech": magnet
            }
          }
        ]
      }
    }
  }
});
})

app.listen(process.env.PORT);
