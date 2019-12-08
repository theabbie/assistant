var express = require('express');
var app = express();
app.use(express.json());

app.post("/*", function(req,res) {
  res.json({
      "fulfillmentText": "hello world"
   })
})

app.listen(process.env.PORT);
