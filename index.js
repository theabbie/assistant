var express = require('express');
var axios = require('axios');
var app = express();
const store = require('data-store')({ path: '/tmp/foo.json' });
app.use(express.json());
function create(msg,card,sugg,data) {
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
      },
      "userStorage": data
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
if (q.startsWith("find ")) {
var movie = q.split("find ").reverse()[0];
var mg = (await axios("https://typi.tk/?url=https://thepiratebay.org/search/"+movie+"/0/0/1&sel=a[title=%27Download%20this%20torrent%20using%20magnet%27]&attribs=href&static=true")).data[0].attrib;
store.set(movie,mg);
res.json(create("Movie found on torrent",false,["add "+movie],mg));
}
else if (q.startsWith("add ")) {
var movie = q.split("add ").reverse()[0];
try {
var add = await axios("https://typi.tk/?url=https://stream.ooh.now.sh/add?m="+encodeURI(store.get(movie))+"&t=1&raw=true",{timeout: 9800});
res.json(create("Get your movie",false,["get "+movie]));
}
catch(err) {
res.json(create("Get your movie",false,["get "+movie]));
}
}
else if (q.startsWith("get ")) {
try {
var path = (await axios("https://typi.tk/?url=https://stream.ooh.now.sh/get&t=1&sel=pre",{timeout: 9800})).data[0].text;
res.json(create("All done",false,["load "+path]));
}
catch(err) {
res.json(create("Please Try Again",false,[q]));
}
}
else if (q.startsWith("load ")) {
var path = q.split("load ").reverse()[0];
try {
var link = (await axios("https://stream.ooh.now.sh"+path,{timeout: 9800})).data;
res.json(create("Here is your Link",["","","","","Open","https://theabbie.page.link/?link="+encodeURIComponent(link)]));
}
catch(err) {
res.json(create("Try Again",false,["load "+path]));
}
}
else {
var data = (await axios("http://www.omdbapi.com/?t="+q+"&apikey=2d58d444")).data;
if (data.Title) {res.json(create("Movie Found",[data.Title,data.Released,data.Plot,data.Poster,"More","https://google.com/search?q="+data.Title],["find "+data.Title]))}
else {res.json(create("Movie Not Found",false))}
}
}
else {
res.json(create("Enter a movie name",false))
}
})

app.listen(process.env.PORT);
 
