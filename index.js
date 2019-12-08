var express = require('express');
var axios = require('axios');
var app = express();
app.use(express.json());
function create(msg,card,ct,cs,cd,img,btn,url,arr) {
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
if (arr) {
result.payload.google.richResponse.suggestions = [];
arr.forEach(function(x) {result.payload.google.richResponse.suggestions.push({"title": x})})
}
}
return result;
}

app.post("/*", async function(req,res) {
//req.body.queryResult.queryText
if (req.body.queryResult.queryText) {
var data = (await axios("http://www.omdbapi.com/?t="+req.body.queryResult.queryText+"&apikey=2d58d444")).data;
if (data.Title) {res.json(create("Movie Found",true,data.Title,data.Released,data.Plot,data.Poster,"More","https://google.com/search?q="+data.Title,["yes","no"]))}
else {res.json(create("Movie Not Found",false))}
}
else {
res.json(create("Enter a movie name",false))
}
})

app.listen(process.env.PORT);
