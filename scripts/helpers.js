var fs = require('fs');
var watson = require('./Watson');
var IP = null;
var port = null;
var homeDir = null;
//Call this function to delete a temp file in the server file system.
//location is where the file is located on the file system.
// ex 'C:/Users/Asher/Desktop/Work/JS/web/WatsonTestServer/uploads/' + file.originalname
exports.deleteFile = function(location){
    fs.unlink(location, function(err){
        if (err){
            return console.error(err);
        }
        console.log("File deleted successfully!");
    });
};
//call this function to save a file to the system
//File is the file object created when sent in a post ccall
//saveLoc is the filelocation and the name of the file.
//ex: 'C:/Users/Asher/Desktop/Work/JS/web/WatsonTestServer/uploads/' + file.originalname
exports.saveFile = function(file, saveLoc){
    fs.readFile(file.path, function(err,data){
        //Write to a new picture in home pictures folder
        fs.writeFile(saveLoc, data, function(err)
        {
            if(err)
                console.log(err);
            else {
                response = {
                    message:'file uploaded successfully',
                    filename: file.originalname
                };
            }
           console.log(response);
        });
    });
};
//This function should be called in the very start of the program to make sure all variables are
//created
//info
exports.setup = function(args,dir){
    IP = args[0];
    port = args[1];
    watson.apiKey(args[2]);
    homeDir = dir;
    console.log(homeDir);
};
//This function returns the variable homeDir 
exports.getDir = function(){
    return homeDir;
};