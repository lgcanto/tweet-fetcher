const request = require('request');
const fs = require('fs');
const dataFileName = 'infomoney-tweets.json';
let requestOptions  = {
  uri: 'https://api.twitter.com/1.1/tweets/search/fullarchive/dev.json',
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'authorization': 'Bearer {{Twitter API Bearer Token}}'
  },
  json: {
    'query':'from:infomoney lang:pt',
    'maxResults': '100',
    'fromDate':'201909120000', 
    'toDate':'201909130000'
  }
};

function fetchTweets() {
  setTimeout(() => {
    request(requestOptions, function (error, response, body) {
      var content = JSON.stringify(body, null, 2);
      fs.appendFile(dataFileName, ',\n' + content, function (appendError) {
        
        if (appendError) { //if file doesn't exist, create a new one
          console.log(`fs.appendFile error: ${appendError}`)
          fs.writeFile(dataFileName, content, function(writeFileError) {
            if(writeFileError) {
              return console.log(`fs.appendFile error: ${writeFileError}`);
            }
          });
        }
        
      });

      let newFromDate = formatDate(parseToDate(requestOptions.json.fromDate.replace('0000', '')) - 1)
      let newToDate = formatDate(parseToDate(requestOptions.json.toDate.replace('0000', '')) - 1)
      requestOptions.json.fromDate = newFromDate;
      requestOptions.json.toDate = newToDate;
      fetchTweets();
    });
  }, 1000);
}

function parseToDate(str) {
  if(!/^(\d){8}$/.test(str)) return "invalid date";
  var y = str.substr(0,4),
      m = str.substr(4,2) - 1,
      d = str.substr(6,2);
  return new Date(y,m,d);
}

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return `${year}${month}${day}0000`;
}

fetchTweets();