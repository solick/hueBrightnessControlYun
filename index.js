/**
 * Created by lynmatten on 29.05.15.
 */


var http = require('http');
var Hue = require("node-hue-api");
var HueApi = require("node-hue-api").HueApi;
var lightState = Hue.lightState;
var q = require('q');
var moment = require('moment');

var config = require('./config.js');



var url ='http://' + config.Yun.ip + config.Yun.path;


var hostname = "IPADDRESS",
    username = config.Hue.username,
    newUserName = null,
    api,
    userDescription = config.Hue.userDescription,
    state,
    stateOn,
    stateOff,
    scenePrefix = config.Hue.scenePrefix,
    timeout = null,
    port = null;


var hueTimer = 0;
var hueState = "not active";

state = lightState.create();
stateOn = lightState.create().on().white(400,100);
stateOff = lightState.create().off();


var displayBridges = function(bridge) {
    console.log("Hue Bridges Found: " + JSON.stringify(bridge));
};

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};
var displayResults = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var displayUserResult = function(result) {
    console.log("Created user: " + JSON.stringify(result));
};

var displayError = function(err) {
    console.log(err);
};



var getBrightness = function() {

    var req = http.get(url, function(res) {

        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            //console.log('BODY: ' + chunk);

            checkHueStateBrightness(chunk);


        });

    }).on('error', function(err) {
        console.log(err);
    });


};




var checkHueStateBrightness = function(state) {

    //console.log("state: " + state.trim());
    //console.log("hueState: " + hueState);

    switch(state.trim()) {

        case "LOW":
            //scene sky


            if(hueState != "LOW") {


                console.log("activate scene sky.");
                api.activateScene("507021e6c-on-0")
                    .then(displayResults)
                    .done();
                hueState = "LOW";
            }



            break;

        case "MEDIUM":
            //scene computer Arbeit

            if (hueState != "MEDIUM") {


                console.log("activate scene Computer Arbeit.");
                api.activateScene("197bac2ca-on-0")
                    .then(displayResults)
                    .done();




                hueState = "MEDIUM";

            }



            break;

        case "HIGH":

            //set off

            if(hueState != "HIGH") {

                console.log("disable Hue lights.");
                api.setGroupLightState(0, stateOff)
                    .then(displayResult)
                    .done();

                hueState = "HIGH";
            }


            break;

        default:

            //not active
            console.log("brightness detection not enabled.");
            hueState = "not active";

            break;

    }

};




/*****************/
//Start Programm
/****************/

Hue.nupnpSearch().then(function(result) {


    hostname = result[0].ipaddress;

    if(hostname == undefined) {
        throw new Error ("cannot find Hue Gateway");
    }
    else {
        console.log("detected hue gateway at " + hostname);
        api = new HueApi(hostname, username, timeout, port, scenePrefix);
        //api = new HueApi(hostname, username);

        var interval = setInterval(getBrightness, 2000);
    }



}).catch(function(err) {

    console.log(err);
})
.done();





/******************/

