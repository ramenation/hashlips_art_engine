const basePath = process.cwd();
const fs = require("fs");

let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
let data = JSON.parse(rawdata);
let editionSize = data.length;


//create array of numbers from edition size
const dataLength = Array.from({length: editionSize}, (x, i) => i);
const shuffleLength = Array.from({length: editionSize}, (x, i) => i);


shuffle(shuffleLength);
dataLength.forEach(printThis);
dataLength.forEach(removeTemp);

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// randomizing sort
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
  
    return array;
  }


/*
// Load the filesnames into an array
const directoryPath = path.join(__dirname, 'Documents');
cons dirPath = (`${basePath}/build/images/`);
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(file); 
    });
});
*/

// rename pass 1 
// https://www.codegrepper.com/code-examples/javascript/get+an+array+of+all+files+in+directory+using+node+js 
// consider renaming based on filename array
function printThis(item){
    //console.log(item + " , " + shuffleLength[item]);

    fs.rename(`${basePath}/build/images/${item}.png`, `${basePath}/build/images/${shuffleLength[item]}.png.temp`, function(err) {
        if ( err ) console.log('ERROR: ' + err);
    });

    fs.rename(`${basePath}/build/json/${item}.json`, `${basePath}/build/json/${shuffleLength[item]}.json.temp`, function(err) {
        if ( err ) console.log('ERROR: ' + err);
    });
   //update metadata pass 
}

//rename past temp
function removeTemp(item){
    // console.log(item + " , " + shuffleLength[item]);

    fs.rename(`${basePath}/build/images/${item}.png.temp`, `${basePath}/build/images/${item}.png`, function(err) {
        if ( err ) console.log('ERROR: ' + err);
    });

    fs.rename(`${basePath}/build/json/${item}.json.temp`, `${basePath}/build/json/${item}.json`, function(err) {
        if ( err ) console.log('ERROR: ' + err);
    });
   
}


//construct new _metadata file
