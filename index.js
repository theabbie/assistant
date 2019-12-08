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
          },
          {
            "basicCard": {
              "title": "Title: this is a title",
              "subtitle": "This is a subtitle",
              "formattedText": "This is a basic card.  Text in a basic card can include \"quotes\" and\n    most other unicode characters including emojis.  Basic cards also support\n    some markdown formatting like *emphasis* or _italics_, **strong** or\n    __bold__, and ***bold itallic*** or ___strong emphasis___ as well as other\n    things like line  \nbreaks",
              "image": {
                "url": "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
                "accessibilityText": "Image alternate text"
              },
              "buttons": [
                {
                  "title": "This is a button",
                  "openUrlAction": {
                    "url": "https://assistant.google.com/"
                  }
                }
              ],
              "imageDisplayOptions": "CROPPED"
            }
          }
        ]
      }
    }
  }
});
})

app.listen(process.env.PORT);
