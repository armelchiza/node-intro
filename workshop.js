var request = require('request-promise');
// Euclidian distance between two points
function getDistance(pos1, pos2) {
  return Math.sqrt(Math.pow(pos1.lat - pos2.lat, 2) + Math.pow(pos1.lng - pos2.lng, 2));
}

console.log('hello');

function getIssPosition() {
  return request("http://api.open-notify.org/iss-now.json")
  .then(
    function(responce) {
      // Parse as JSON
      // Return object with lat and lng
      var returned = {lat: 0, lng: 0};
      returned.lat = JSON.parse(responce).iss_position.latitude;
      returned.lng = JSON.parse(responce).iss_position.longitude;
      return(returned);
    }
  )
}

function getAddressPosition(address) {
   var link = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyA20qf0-wOeSRHUynZN4VXwzRaZ9_GEzfw"
  return request(link)
  .then(
    function(response) {
      var newResponse = JSON.parse(response);
      var yourPosition = newResponse.results[0].geometry.location;
      return(yourPosition);
    }
  )
}

// API KEY : AIzaSyA20qf0-wOeSRHUynZN4VXwzRaZ9_GEzfw
function getCurrentTemperatureAtPosition(position) {
  var key = "5612f1c3bb6024a6eb085d59521682c7";
  var latitude = position.lat;
  var longitude = position.lng;
  var link = "https://api.darksky.net/forecast/" + key +
"/" + latitude + "," + longitude;
  return request(link).then( // makes a request for the JSON object from DarkSky
    function(theresponse) {
      var response = JSON.parse(theresponse);
      console.log(response.currently.temperature);
      return(response.currently.temperature);
    }
  )
}

function getCurrentTemperature(address) {
  getAddressPosition(address).then(
    function (position) {
      console.log(position);
      var temp = getCurrentTemperatureAtPosition(position);
      return temp;
    }
  )
}

function getDistanceFromIss(address) {
  var iss;
  var pos;
  var p1 = new Promise(function(){
    iss = getIssPosition();
  });
  var p2 = new Promise(function(){
    pos = getAddressPosition(address);
  })
  Promise.all([p1, p2]).then(
    function(iss, pos){
      var dist = getDistance(iss, pos);
      console.log(iss);
      console.log(dist);
      return (dist);
    }
  )
  console.log(iss);
}
getDistanceFromIss("montreal");
