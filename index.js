var express = require('express');
var axios = require('axios');
var app = express();
app.use(express.json());
function create(msg,card,sugg) {
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
result.payload.google.richResponse.items.push({
            "basicCard": {
              "title": card[0],
              "subtitle": card[1],
              "formattedText": card[2],
              "image": {
                "url": card[3],
                "accessibilityText": card[0]
              },
              "buttons": [
                {
                  "title": card[4],
                  "openUrlAction": {
                    "url": card[5]
                  }
                }],
              "imageDisplayOptions": "CROPPED"
            }
          });
if (sugg) {
result.payload.google.richResponse.suggestions = [];
sugg.forEach(function(x) {result.payload.google.richResponse.suggestions.push({"title": x})})
}
}
return result;
}

app.post("/*", async function(req,res) {
//req.body.queryResult.queryText
if (req.body.queryResult.queryText) {
var data = (await axios("http://www.omdbapi.com/?t="+req.body.queryResult.queryText+"&apikey=2d58d444")).data;
if (data.Title) {res.json(create("Movie Found",[data.Title,data.Released,data.Plot,data.Poster,"More","https://google.com/search?q="+data.Title],["yes","no"]))}
else {res.json(create("Movie Not Found",false))}
}
else {
res.json(create("Enter a movie name",false))
}
})

app.listen(process.env.PORT);
