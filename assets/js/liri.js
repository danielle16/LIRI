// require("dotenv").config();

var keys = require("../js/keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var omdb = require('omdb');
var fs = require("fs");
var request = require('request');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

console.log("Please enter one of the following commands:\n my-tweets \n spotify-this-song 'song title'\n movie-this 'movie title'\n do-what-it-says");

var userInput = process.argv[2];
var myTweets = "my-tweets";
var spotifyInput = "spotify-this-song";
var movieInput = "movie-this";
var doWhatItSays = "do-what-it-says";

// Tweets Output
var params = {screen_name: 'danielleg16'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    for(var i = 0; i < tweets.length; i++) {
        if(userInput == myTweets){
        console.log(JSON.stringify(tweets[i].text, null, 2));
        }
    }
  }

});


// Spotify Search 
if(userInput == spotifyInput) {
    var songTitle = process.argv[3];

spotify.search({ type: 'track', query: songTitle}, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
   
    var artists = data.tracks.items[0].album.artists; 
    var artistNames = [];

    for (var i = 0; i < artists.length; i++) {
        artistNames.push(artists[i].name);
    }

    var songName = data.tracks.items[0].name;
    var url = data.tracks.items[0].preview_url;
    var albumName = data.tracks.items[0].album.name;

    console.log("Artist: " + artistNames);
    console.log("Song Title: " + songName);
    console.log("Link: " + url);
    console.log("Album Name: " + albumName);
  });
}

// OMDB Search
if(userInput == movieInput) {
    var movieTitle = process.argv[3];
request("http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy&r=json", function(error, response, body) {
  if (!error & response.statusCode === 200) {
      var movie = JSON.parse(body);
      console.log("Movie Title: " + movie.Title);
      console.log("IMDB Rating: " + movie.imdbRating);
      console.log("Rotten Tomatoes Rating: " + movie.Ratings[1].Value);
      console.log("Country film was produced in: " + movie.Country);
      console.log("Language: " + movie.Language);
      console.log("Plot: " + movie.Plot);
      console.log("Actors: " + movie.Actors);
      
  }

});
}

// Do what it says
if(userInput == doWhatItSays){
fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    } 
    console.log(data.split(","));
  });
}
