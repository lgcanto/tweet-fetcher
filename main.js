const request = require('request');
const fs = require('fs');
const requestOptions  = {
  uri: 'https://api.twitter.com/1.1/tweets/search/fullarchive/dev.json',
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'authorization': 'Bearer {{Twitter API Bearer Token}}'
  },
  json: {
    'query':'from:infomoney lang:pt',
    'maxResults': '100',
    'fromDate':'201909070000', 
    'toDate':'201909080000'
  }
};

request(requestOptions, function (error, response, body) {
  var content = JSON.stringify(body, null, 2);
  fs.writeFile('infomoney-tweets.json', content, function(err) {
    if(err) {
      return console.log(err);
    }
  });
});