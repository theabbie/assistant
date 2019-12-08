var express = require('express');
var axios = require('axios');
var app = express();
app.use(express.json());
function create(msg,card,ct,cs,cd,img,btn,url) {
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
              "subtitle": cs,
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
if (req.body.queryResult.queryText) {
var data = (await axios("http://www.omdbapi.com/?t="+req.body.queryResult.queryText+"&apikey=2d58d444")).data;
res.json(create("Movie Found",true,data.Title,data.Released,data.Plot,data.Poster,"More","https://google.com/search?q="+data.Title));
}
else {
res.json(create("Enter a movie name",false))
}
})

app.listen(process.env.PORT);
