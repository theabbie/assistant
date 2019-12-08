var express = require('express');
var app = express();
app.use(express.json());

app.post("/*", function(req,res) {
  res.json({
      "fulfillmentText": req.body.queryResult.queryText,
      "fulfillmentMessages": [
        {
          "card": {
            "title": req.body.queryResult.queryText,
            "subtitle": req.body.queryResult.queryText,
            "imageUri": "https://theabbie.github.io/files/logo.png",
            "buttons": [
              {
                "text": "Go",
                "postback": "https://theabbie.github.io/"
              }
            ]
          }
        }
      ],
      "source": "https://theabbie.github.io",
      "payload": {
        "google": {
          "expectUserResponse": true,
          "richResponse": {
            "items": [
              {
                "simpleResponse": {
                  "textToSpeech": req.body.queryResult.queryText
                }
              }
            ]
          }
        },
        "facebook": {
          "text": req.body.queryResult.queryText
        },
        "slack": {
          "text": req.body.queryResult.queryText
        }
      },
      "outputContexts": [
        {
          "name": "projects/${PROJECT_ID}/agent/sessions/${SESSION_ID}/contexts/context name",
          "lifespanCount": 5,
          "parameters": {
            "param": "param value"
          }
        }
      ],
      "followupEventInput": {
        "name": "event name",
        "languageCode": "en-US",
        "parameters": {
          "param": "param value"
        }
      }
   })
})

app.listen(process.env.PORT);
