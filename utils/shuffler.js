const basePath = process.cwd();
const { SSL_OP_EPHEMERAL_RSA } = require("constants");
const { NETWORK } = require(`${basePath}/constants/network.js`);
const fs = require("fs");
const { exec } = require("child_process");
const { network } = require(`${basePath}/src/config.js`);
  

let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
let data = JSON.parse(rawdata);
let editionSize = data.length;

main();


async function main() {
//create array of numbers from edition size
dataLength = Array.from({length: editionSize}, (x, i) => i);
shuffleLength = Array.from({length: editionSize}, (x, i) => i);

//run shuffle
    shuffleLength = shuffle(shuffleLength);

//get filenames
    fileNames = getFilenames();

//rename files according to shuffle with .temp extension to avoid conflicts
   await renameFile(fileNames,shuffleLength);

//remove .temp from files
   await dataLength.forEach(removeTemp);

//update metadata and construct new _metadata file
   await update_info();


  
}

//do the shuffled pngs match with json

//randomize files numbers and rename png and json to .temp files to avoid conflicts
function renameFile(fileArray,shuffleArray,__callback){
for (let i = 0; i < fileArray.length; i++) {

    fs.rename(`${basePath}/build/images/${fileArray[i]}.png`, `${basePath}/build/images/${shuffleArray[i]}.png.temp`, function(err) {
        //console.log(`Updated ${fileNames[i]}.png to ===> ${shuffleLength[i]}.png.temp`);
        if ( err ) console.log('ERROR: ' + err);
    });
    fs.rename(`${basePath}/build/json/${fileArray[i]}.json`, `${basePath}/build/json/${shuffleArray[i]}.json.temp`, function(err) {
        //console.log(`Updated  ${fileNames[i]}.json to ===> ${shuffleLength[i]}.json.temp`);
        if ( err ) console.log('ERROR: ' + err);
    });   

  }
__callback;
}

//remove .temp extensions
function removeTemp(item,__callback){
    fs.rename(`${basePath}/build/images/${item}.png.temp`, `${basePath}/build/images/${item}.png`, function(err) {
        //console.log(`Updated ${item}.png.temp to ===> ${item}.png`);
        if ( err ) console.log('ERROR: ' + err);
    });
    fs.rename(`${basePath}/build/json/${item}.json.temp`, `${basePath}/build/json/${item}.json`, function(err) {
        //console.log(`Updated ${item}.json.temp to ===> ${item}.json`);
        if ( err ) console.log('ERROR: ' + err);
    });
   __callback;
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// randomizing sort via Knuth shuffle - interesting reading about randomness
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    // Change array to include 0 and n-1 for Solana
    if (network == NETWORK.sol){
        array.map(element=>element - 1);
        return array;
    }
    else {
        return array;
    }
  }

// Load all existing filenames into an array
function getFilenames(){
    const dirPath = (`${basePath}/build/images/`);
    var filenumber=[];
    var numFile=[];
    var counter = 0;
    var thisFile = fs.readdirSync(dirPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    });
    numFile = thisFile.forEach(function (file) {
        // strip out extension
        filenumber[counter] = file.substr(0, file.indexOf('.'));
        counter++;
      });

    
    return filenumber;
  
};




function update_info(){
    exec("npm run update_info", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    }); 
};