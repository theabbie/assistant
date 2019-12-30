var express = require('express');
var axios = require('axios');
var jwt = require("jsonwebtoken");
var app = express();
app.use(express.json());
function create(msg,card,sugg,data,list) {
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
result.fulfillmentMessages = [
        {
          "card": {
            "title": card[0],
            "subtitle": card[2],
            "imageUri": card[3],
            "buttons": [
              {
                "text": card[4],
                "postback": card[5]
              }
            ]
          }
        }
      ];
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
if (list) {
var title = list[0];
list.shift();
result.payload.google.systemIntent = {
        "intent": "actions.intent.OPTION",
        "data": {
          "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
          "listSelect": {
            "title": title,
            "items": list.map(function(x) {return {
                "optionInfo": {
                  "key": Array.isArray(x)?x[0]:x,
                  "synonyms": Array.isArray(x)?[x[0]]:[x]
                },
                "description": Array.isArray(x)?x[1]:x,
                "image": {
                  "url": Array.isArray(x)?x[2]:"https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
                  "accessibilityText": Array.isArray(x)?x[0]:x
                },
                "title": Array.isArray(x)?x[0]:x
              }})
          }
        }
      };
}
return result;
}

app.post("/talk", async function(req,res) {
var q = req.body.queryResult.queryText || req.body.originalDetectIntentRequest.payload.inputs[0].rawInputs[0].query;
if (req.body.originalDetectIntentRequest.payload.inputs[0].intent=="actions.intent.MAIN" || q=="restart" || req.body.originalDetectIntentRequest.payload.user.userStorage=="reset") {
res.json(create((req.body.originalDetectIntentRequest.payload.user.idToken?("Hello "+jwt.decode(req.body.originalDetectIntentRequest.payload.user.idToken).name+", "):"")+"What would you like to do?",false,req.body.originalDetectIntentRequest.payload.user.idToken?["exit"]:["create an account","exit"],"reset",["Tools",["Shorten a url","Enter a long url and shorten it","https://miro.medium.com/max/300/1*jcRqWsK1oYk3f77sbiDYEg.png"],["Find Definition","get meaning of words","https://www.collinsdictionary.com/images/full/dictionary_168552845.jpg"],["Lyrics","Find song lyrics","https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRkeSDnPvD5rOPwfxlGSFKWqmCmNdpwXwlfbCAKq-hLoK2Vcg0B"],["Download youtube video","Youtube","https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRvE71wFt70IDFsb9j9_CIzkNh_JkhxMMCbRoqlnZTliPtWSNjL"],["Get coordinates","get coordinates from address","https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRXzTfFwIsObocu7R64VcSW9l5wXPtxjd0j-aSiRfIGjmIgyk5c"],["News","Top news","https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQEHhixWywDlPMR9r7oJ_0bZnN8DqxHOo1yoDlOSRIwh-Af8NoO"],["generate QR code","QR code","https://firebase.google.com/docs/ml-kit/images/examples/qrcode.png"]]))
}
else if (req.body.originalDetectIntentRequest.payload.inputs[0].intent=="actions.intent.OPTION") {
if (q=="Shorten a url") {res.json(create("Enter a url",false,["exit","restart"],q))}
else if (q=="Find Definition") {res.json(create("Enter a word",false,["exit","restart"],q))}
else if (q=="Lyrics") {res.json(create("Enter song name",false,["exit","restart"],q))}
else if (q=="Download youtube video") {res.json(create("Enter youtube video url",false,["exit","restart"],q))}
else if (q=="Get coordinates") {res.json(create("Enter Address",false,["exit","restart"],q))}
else if (q=="News") {res.json(create("Here are the top headlines",false,["exit","restart"],"",["Top Headlines",...(await axios("https://newsapi.org/v2/top-headlines?country=us&apiKey=5becfbf90a534dca83aaa44198f9e387")).data.articles.slice(0,6).map(x=>[x.title,x.description,x.urlToImage])]))}
else if (q=="generate QR code") {res.json(create("Enter Data",false,["exit","restart"],q))}
else {res.json(create("Search google for "+q,["","","","","Search","https://google.com/search?q="+q],["exit","restart"],"reset"))}
}
else {
try {
if (q=="create an account") {
res.json({
  "payload": {
    "google": {
      "expectUserResponse": true,
      "systemIntent": {
        "intent": "actions.intent.SIGN_IN",
        "data": {
          "@type": "type.googleapis.com/google.actions.v2.SignInValueSpec"
        }
      }
    }
  }
})
}
else if (req.body.originalDetectIntentRequest.payload.user.userStorage=="Shorten a url") {
res.json(create((await axios("https://is.gd/create.php?format=simple&url="+q)).data,false,["exit","restart"],"reset"))
}
else if (req.body.originalDetectIntentRequest.payload.user.userStorage=="Find Definition") {
res.json(create((await axios("https://typi.tk/?url=https://www.lexico.com/en/definition/"+q+"&sel=.ind&attribs=classs&static=true")).data.map(x=>x.text).join("\n")+"\n source: Lexico.com",false,["exit","restart"],"reset"))
}
else if (req.body.originalDetectIntentRequest.payload.user.userStorage=="Lyrics") {
res.json(create((await axios("https://typi.tk/?url=https://www.google.com/search?q="+q+" lyrics&sel=span[jsname]&attribs=classs&t=1")).data.map(x=>x.text).join("\n")+"\n source: musixmatch.com",false,["exit","restart"],"reset"))
}
else if (req.body.originalDetectIntentRequest.payload.user.userStorage=="Download youtube video") {
res.json(create("Here is your download link",["","","","","Download",(await axios("https://typi.tk/?url=https://sfrom.net/"+q+"&attribs=href&sel=.link-group%20a&t=5000")).data[0].attrib],["exit","restart"],"reset"))
}
else if (req.body.originalDetectIntentRequest.payload.user.userStorage=="Get coordinates") {
res.json(create((await axios("https://typi.tk/?url=https://google.com/maps/search/"+q+"&new=true&t=2000")).data.split("@").reverse()[0].split(",").slice(0,2).join(","),false,["exit","restart"],"reset"))
}
else if (req.body.originalDetectIntentRequest.payload.user.userStorage=="generate QR code") {
res.json(create("QR Code",["","","","https://chart.googleapis.com/chart?cht=qr&chl="+q+"&choe=UTF-8&chs=100x100"],["exit","restart"],"reset"))
}
else {
res.json(create("Please select a tool",false,["exit"]))
}
}
catch (err) {
res.json(create("Sonething wrong happened, try again, and if it still causes error, something must be wrong in your input",false,["exit","restart"]));
}
}
})

app.post("/*", async function(req,res) {
var q = req.body.queryResult.queryText || req.body.originalDetectIntentRequest.payload.inputs[0].rawInputs[0].query || "ask movie robot";
if (q=="create an account") {
res.json({
  "payload": {
    "google": {
      "expectUserResponse": true,
      "systemIntent": {
        "intent": "actions.intent.SIGN_IN",
        "data": {
          "@type": "type.googleapis.com/google.actions.v2.SignInValueSpec"
        }
      }
    }
  }
})
}
else if (req.body.originalDetectIntentRequest.payload.inputs[0].intent=="actions.intent.OPTION") {
var data = (await axios("http://www.omdbapi.com/?t="+req.body.originalDetectIntentRequest.payload.inputs[0].rawInputs[0].query+"&apikey=2d58d444")).data;
if (data.Title) {res.json(create("Movie Found",[data.Title,data.Released,data.Plot,data.Poster,"More","https://google.com/search?q="+data.Title],["find "+data.Title,"exit"]))}
else {res.json(create("Movie Not Found",false,["exit"]))}
}
else if (q.startsWith("find ")) {
var movie = q.split("find ").reverse()[0];
var mg = (await axios("https://typi.tk/?url=https://thepiratebay.org/search/"+movie+"/0/0/1&sel=a[title=%27Download%20this%20torrent%20using%20magnet%27]&attribs=href&static=true")).data[0].attrib;
res.json(create("Movie found on torrent",false,["add "+movie,"exit"],mg));
}
else if (q.startsWith("add ")) {
var movie = q.split("add ").reverse()[0];
try {
var add = await axios("https://stream.ooh.now.sh/add?m="+encodeURI(req.body.originalDetectIntentRequest.payload.user.userStorage),{timeout: 9900});
res.json(create("Get your movie",false,["get "+movie,"exit"]));
}
catch(err) {
res.json(create("Get your movie",false,["get "+movie,"exit"]));
}
}
else if (q.startsWith("get ")) {
try {
var path = (await axios("https://stream.ooh.now.sh/get",{timeout: 9900})).data;
res.json(create("All done",false,["load "+q.split("get ").reverse()[0],"exit"],path));
}
catch(err) {
res.json(create("Please Try Again",false,[q,"exit"]));
}
}
else if (q.startsWith("load ")) {
try {
var link = (await axios("https://stream.ooh.now.sh"+req.body.originalDetectIntentRequest.payload.user.userStorage,{timeout: 9800})).data;
res.json(create("Here is your Link, Tell me to delete the movie after you are done watching",["","","","","Open","https://theabbie.page.link/?link="+encodeURIComponent(link)],req.body.originalDetectIntentRequest.payload.user.idToken?["delete "+q.split("load ").reverse()[0],"exit"]:["delete "+q.split("load ").reverse()[0],"create an account","exit"]));
}
catch(err) {
res.json(create("Try Again",false,[q,"exit"]));
}
}
else if (q.startsWith("delete ")) {
try {
var link = await axios("https://stream.ooh.now.sh/delete",{timeout: 9900});
res.json(create("Done",false,["exit"]));
}
catch(err) {
res.json(create("Try Again",false,[q,"exit"]));
}
}
else if (req.body.originalDetectIntentRequest.payload.inputs[0].intent=="actions.intent.TEXT") {
var list = (await axios("http://api.themoviedb.org/3/search/movie?api_key=a7219d99028ec2f029a458c81ba22b37&query="+q)).data.results.map(x => [x.title,x["release_date"],"http://image.tmdb.org/t/p/w185"+x["poster_path"]]);
if (list.length==0) {res.json(create("Movie Not Found",false,["exit"]))}
else if (list.length==1) {
var data = (await axios("http://www.omdbapi.com/?t="+q+"&apikey=2d58d444")).data;
if (data.Title) {res.json(create("Movie Found",[data.Title,data.Released,data.Plot,data.Poster,"More","https://google.com/search?q="+data.Title],["find "+data.Title,"exit"]))}
else {res.json(create("Movie Not Found",false,["exit"]))}
}
else {
res.json(create("I found this",false,false,false,["Movies matching your query",...list]));
}
}
else {
res.json(create((req.body.originalDetectIntentRequest.payload.user.idToken?("Hello "+jwt.decode(req.body.originalDetectIntentRequest.payload.user.idToken).name+", "):"")+"Enter a movie name or search term",false,req.body.originalDetectIntentRequest.payload.user.idToken?["exit"]:["create an account","exit"]))
}
})

app.listen(process.env.PORT);
 
