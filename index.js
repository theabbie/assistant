var express = require('express');
var app = express();
app.use(express.json());

app.post("/*", function(req,res) {
  res.json({
      "fulfillmentText": req.body.queryResult.queryText,
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
