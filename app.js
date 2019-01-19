const express = require('express')
const app = express()
const fs = require('fs')

const config = require('./config.js')
const request = require('request')

app.listen(config.port,() =>
{
    console.log("Magic happens on port "+ config.port)
})

app.get('/', function(req, res, next){
    request.post({url:`https://www.googleapis.com/geolocation/v1/geolocate?key=${config.api_key}`, json: true}, function(err, response, body){
        let lattitude = body.location.lat
        let longitude = body.location.lng
        request.get({url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lattitude},${longitude}&key=${config.api_key}`, json: true}, function(err, response, body){

            fs.appendFile('./userlog.log',"\n"+ Date()+JSON.stringify(body.results)+"\n",(err,data)=>{
                if (err)
                  console.log("Error in saving");
                else
                  console.log("Saved user location data in file");    
            })

            let results = {
                address : body.results[0].formatted_address,
                geoloc: body.results[0].geometry.location
            }
            res.json(results)
          })
      })
})
