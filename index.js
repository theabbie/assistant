var express = require('express');
var app = express();
app.use(express.json());

app.post("/*", function(req,res) {
  res.json({
      "fulfillmentText": "hello world",
      "source": "https://theabbie.github.io",
      "payload": {
        "google": {
          "expectUserResponse": true,
          "richResponse": {
            "items": [
              {
                "simpleResponse": {
                  "textToSpeech": "hello world"
                }
              }
            ]
          }
        },
        "facebook": {
          "text": "hello world"
        },
        "slack": {
          "text": "hello world"
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
