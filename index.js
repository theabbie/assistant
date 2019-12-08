var express = require('express');
var app = express();
app.use(express.json());

app.post("/*", function(req,res) {
res.json({
  "fulfillmentText": req.body.queryResult.queryText,
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
    }
  }
});
})

app.listen(process.env.PORT);
