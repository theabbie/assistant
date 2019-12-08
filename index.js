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
        }
if (sugg) {
result.payload.google.richResponse.suggestions = [];
sugg.forEach(function(x) {result.payload.google.richResponse.suggestions.push({"title": x})})
}
return result;
}

app.post("/*", async function(req,res) {
var q = req.body.queryResult.queryText
if (req.body.queryResult.queryText) {
if (q.startsWith("watch ")) {
var movie = q.split("watch ").reverse()[0];
setTimeout(function () {res.json(create("Movie found on torrent",false,["stream "+movie]));},9500);
var mg = (await axios("https://typi.tk/?url=https://thepiratebay.org/search/"+movie+"/0/0/1&sel=a[title=%27Download%20this%20torrent%20using%20magnet%27]&attribs=href&static=true")).data[0].attrib;
var add = await axios("https://stream.ooh.now.sh/add?m="+mg);
}
else if (q.startsWith("stream ")) {
var path = (await axios("https://stream.ooh.now.sh/get")).data;
var link = (await axios("https://stream.ooh.now.sh"+path)).data;
res.json(create(link,false));
}
else {
var data = (await axios("http://www.omdbapi.com/?t="+q+"&apikey=2d58d444")).data;
if (data.Title) {res.json(create("Movie Found",[data.Title,data.Released,data.Plot,data.Poster,"More","https://google.com/search?q="+data.Title],["watch "+data.Title]))}
else {res.json(create("Movie Not Found",false))}
}
}
else {
res.json(create("Enter a movie name",false))
}
})

app.listen(process.env.PORT);
