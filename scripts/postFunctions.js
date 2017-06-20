var fs = require('fs');
var watson = require('./Watson');
var AdmZip = require('adm-zip');
var helper = require('./helpers');
//functions that is used to upload files in server.js! is called when 'upload_files' is called
exports.fileUpload = function fileUpload(req,res){
    //looking into the file
    console.log('File Information: \n');
    console.log(req.file);
    //create a link to file that is to be created
    var fileLoc = (helper.getDir() + 'uploads/' + req.file.originalname);
    //create a link that allows watson to create a json file out of this!
    var pictureJSON = req.file.originalname.substring(0,req.file.originalname.length - 4) + '.json';
    //ask watson to create a json file for the given picture you uploaded
    console.log(fileLoc);
    console.log ('\n');
    //Save the file to the home system.
    helper.saveFile(req.file, fileLoc);
    helper.deleteFile(req.file.path);
    //respond to the user that the file was createdp;
    var delay = function(){
        watson.createJSON(req.file.originalname, pictureJSON)
    }
    setTimeout(delay,1000);
    res.write('<!doctype html>');
    res.write('Picture uploaded!<br/>');
    res.write('Go look at your picture!');
    res.write('<a href="/watson/"> <p>go back</p></a>');
    res.end();
};
//This function is called when a user uploads a zip file from the /classify call
exports.zipUpload = function(req,res){
    console.log('File information\n');
    for(i = 0; i < req.files.length; i++){
        var fileLoc = (helper.getDir() + 'class_zip/' + req.files[i].originalname);
        //save the zip file to the local drive
        helper.saveFile(req.files[i],fileLoc);
        //delete the temp file that was created from Multers
        helper.deleteFile(req.files[i].path);
    };
    var wait = function(){
        watson.classify(req.files,req.body.className,req.body.type);
    }
    setTimeout(wait,1000);
    res.write('<!doctype html>');
    res.write('Class Created!<br/>');
    res.write('Go and check out your class. Takes a while to load so give it some time!');
    res.write('<a href="/watson/classes"> <p>go!</p></a>');
    res.end();
};
//This function is called when we want to upload a picture and use a custom classification 
exports.class_upload = function(req,res){
    var classId = req.body.class;
    var file = req.file; 
    var fileLoc = (helper.getDir() +'uploads/' + req.file.originalname);
    console.log(file);
    console.log(classId);
    helper.saveFile(req.file, fileLoc);
    helper.deleteFile(req.file.path);
    //create a delay function to make sure the server is done saving and deleting files
    var delay = function(){
        //send the information to watson to classify 
        watson.customClassify(file,classId);
    };
    setTimeout(delay,1000);
    //print out that the server is done
    res.write('<!doctype html>');
    res.write('Json file created!<br/>');
    res.write('Go check out the picture!');
    res.write('<a href="/watson/"> <p>go!</p></a>');
    res.end();
};
//This function is called when a user wants to upload a picture and use facial recognition
exports.face = function(req,res){
    var file = req.file; 
    var fileLoc = (helper.getDir() + 'uploads/' + file.originalname);
    helper.saveFile(req.file, fileLoc);
    helper.deleteFile(req.file.path);
    //delay the server to allow it to save and delete the files.
    var delay = function(){
        watson.classifyFaces(file);
    };
    setTimeout(delay,1000);
    //print to the user that the server is done. 
    res.write('<!doctype html>');
    res.write('Json file created!<br/>');
    res.write('Go check out the picture!');
    res.write('<a href="/watson/"> <p>go!</p></a>');
    res.end();
    console.log(file);
};