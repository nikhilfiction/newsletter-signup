//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  const data = {
    members : [
      {
        email_address: email,
        status : "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

const jsonData = JSON.stringify(data);
const listId = process.env.LIST_ID;
const apiKey = process.env.API_KEY;
const serverPrefix = process.env.SERVER_PREFIX;

const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}`;
const options = {
  method: "POST",
  auth: `anystring:${apiKey}`
}
const request = https.request(url,options,function(response){
  if(response.statusCode === 200){
    res.sendFile(__dirname+ "/success.html");
  } else{
    res.sendFile(__dirname+ "/failure.html");
  }
  response.on("data",function(data){
    console.log(JSON.parse(data));
  });

});
request.write(jsonData);
request.end();
});

app.post("/failure",function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT ||3000,function(){
  console.log("Server is running on port 3000");
});

//API KEY
//64045695ef4dcf8d0ecf542a86f3afc1-us1
//list id
//7e254304d5
