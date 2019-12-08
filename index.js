var express = require('express');
var axios = require('axios');
var app = express();
app.use(express.json());
function create(msg,card,ct,cd,img,btn,url) {
var result = {
  "fulfillmentText": msg,
  "payload": {
    "google": {
      "expectUserResponse": true,
      "richResponse": {
        "items": [
          {
            "simpleResponse": {
              "textToSpeech": msg
            }
          }
        ]
      }
    }
  }
};
if (card) {
result.fulfillmentMessages = [
        {
          "card": {
            "title": ct,
            "subtitle": cd,
            "imageUri": img,
            "buttons": [
              {
                "text": btn,
                "postback": url
              }
            ]
          }
        }
      ];
result.payload.google.richResponse.items.push({
            "basicCard": {
              "title": ct,
              "subtitle": "From Chiri",
              "formattedText": cd,
              "image": {
                "url": img,
                "accessibilityText": ct
              },
              "buttons": [
                {
                  "title": btn,
                  "openUrlAction": {
                    "url": url
                  }
                }],
              "imageDisplayOptions": "CROPPED"
            }
          });
}
return result;
}

app.post("/*", async function(req,res) {
//req.body.queryResult.queryText
res.json(create("Hello",false));
})

app.listen(process.env.PORT);
