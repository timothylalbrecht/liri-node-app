require("dotenv").config();

var request = require("request");

var keys = require("./keys.js");

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var moment= require("moment");

var fs = require("fs");

var inputTask = process.argv;

var task = inputTask[2];
var taskName = "";

// Loop through to concatenate input args
for (var i = 3; i < inputTask.length; i++) {
    if (i > 3 && i < inputTask.length) {
      taskName = taskName + "+" + inputTask[i];
    }
    else {
      taskName += inputTask[i];
    }
}


if (task === "concert-this") {
    BandsInTown();
}
else if (task === "movie-this") {
    OMDBAPI();
}
else if (task === "spotify-this-song") {
    spotifyAPI();
}
else if (task === "do-what-it-says") {
    doWhatItSays();
}




// Bands in Town API
// concert-this
function BandsInTown () {
    if (taskName === undefined) {
        console.log("\nPlease include a band/artist");
        return;
    }
    else {
        request("https://rest.bandsintown.com/artists/" + taskName + "/events?app_id=codingbootcamp", function (error, response, body) {
            if (JSON.parse(body) == "") {
                console.log("\nNo concerts currently scheduled for " + taskName);
            }
            else {
                for (i=0; i < JSON.parse(body).length; i++) {
                  console.log("\nVenue name: " + JSON.parse(body)[i].venue.name);
                  console.log("Venue location: " + JSON.parse(body)[i].venue.city + ", " + JSON.parse(body)[i].venue.region);
                  console.log("Concert date: " + moment(JSON.parse(body)[i].datetime).calendar());
                }
            }
        });
    }
}

// OMDB API
// movie-this
function OMDBAPI () {
    if (taskName === undefined) {
        var queryUrl = "http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy";
    }
    else {
        var queryUrl = "http://www.omdbapi.com/?t=" + taskName + "&y=&plot=short&apikey=trilogy";
    }

request(queryUrl, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        console.log("\nMovie title: " + JSON.parse(body).Title);
        console.log("Year released: " + JSON.parse(body).Year);
        console.log("IMDB rating: " + JSON.parse(body).imdbRating);
        if (JSON.parse(body).Ratings == "" || JSON.parse(body).Ratings[1] === undefined) {
            console.log("This movie doesn't have a Rotten Tomatoes rating");
        }
        else {
            console.log("Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value);
        }
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Cast: " + JSON.parse(body).Actors);
    }
    });
}


// Spotify API
// spotify-this-song
function spotifyAPI () {
    if (taskName === undefined) {
        var songName = "the sign ace of base";
    }
    else {
        var songName = taskName;
    }
// console.log(keysList.spotify);
spotify.search({ type: 'track', query: songName, limit: 1 }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
   
    console.log("\nArtist: " + data.tracks.items[0].artists[0].name); 
    console.log("Song Title: " + data.tracks.items[0].name);
    console.log("Album: " + data.tracks.items[0].album.name);
    console.log("Spotify Preview Link: " + data.tracks.items[0].preview_url); 
  });
}

// do-what-it-says
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    
    var dataArray = data.split(",");
    task = dataArray[0];
    taskName = dataArray[1];

        if (task === "concert-this") {
            BandsInTown();
        }
        else if (task === "movie-this") {
            OMDBAPI();
        }
        else if (task === "spotify-this-song") {
            spotifyAPI();
        }
  });
}