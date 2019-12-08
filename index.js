var express = require('express');
var app = express();
app.use(express.json());

app.post("/*", function(req,res) {
/*
res.json({
"fulfillmentText": req.body.queryResult.queryText.split(" ").reverse().join(" "),
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
  }
})
*/
res.json({
  "payload": {
    "google": {
      "expectUserResponse": true,
      "richResponse": {
        "items": [
          {
            "simpleResponse": {
              "textToSpeech": "Choose a item"
            }
          }
        ]
      },
      "systemIntent": {
        "intent": "actions.intent.OPTION",
        "data": {
          "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
          "listSelect": {
            "title": "Hello",
            "items": [
              {
                "optionInfo": {
                  "key": "first title key"
                },
                "description": "first description",
                "image": {
                  "url": "https://theabbie.github.io/files/logo.png",
                  "accessibilityText": "first alt"
                },
                "title": "first title"
              },
              {
                "optionInfo": {
                  "key": "second"
                },
                "description": "second description",
                "image": {
                  "url": "https://lh3.googleusercontent.com/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw",
                  "accessibilityText": "second alt"
                },
                "title": "second title"
              }
            ]
          }
        }
      }
    }
  }
});
})

app.listen(process.env.PORT);
