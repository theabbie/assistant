var express = require('express');
var app = express();
app.use(express.json());

app.post("/*", function(req,res) {
/*
res.json({
"fulfillmentText": req.body.queryResult.queryText.split(" ").reverse().join(" ")
})
*/
res.json({
  "fulfillmentText": req.body.queryResult.queryText,
  "payload": {
    "google": {
      "expectUserResponse": true,
      "richResponse": {
        "items": [
          {
            "simpleResponse": {
              "textToSpeech": "this is a simple response"
            }
          }
        ]
      }
    }
  }
});
})

app.listen(process.env.PORT);
