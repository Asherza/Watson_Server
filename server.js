/*
    Author: Asher Straubing
    Last Updated: 6/20/2017 
    Usage: Allows for user interation with IBMs Watson
    File: Server.js
*/

//Make imports and setup variables here
var express = require('express');
var app = express();
var multer = require('multer');
var upload = multer({dest: __dirname + '/temp/'});
var posts = require('./scripts/postFunctions');
var helper = require('./scripts/helpers');
var gets = require('./scripts/getFunctions');
var args = process.argv.slice(2);
//Here we call our helper to set up our variables for later use. 
var dir = __dirname + '\\';
helper.setup(args, dir);


//allows the app to use the uploads folder
app.use('/', express.static('uploads'));
//allows for the app to use the json folder
app.use(express.static('json'));

//set up routes for the local server HERE.
app.get("/", gets.index);

//create a route to the index page
app.get('/index.html', gets.index);

//create a POST route to allow for files to be uploaded to the server!
//ToDo Need to make renaming of files so no over writing is done.
app.post('/file_upload',upload.single('file'), posts.fileUpload);

//This is a get function that lists all of the pictures that are links to the classification that are under
app.get('/watson', gets.watson_path);

//This link sends the json file that is saved to the files
app.get('/watson/*.*', gets.watson_read);

//This get function is a link to allow classifications
app.get('/watson/createclass', gets.classify);

//this post function is used to classify files!
app.post('/zip_upload',upload.array('file',4), posts.zipUpload);

//get function links to all of the classes that watson has!
app.get('/watson/classes', gets.listClasses);

//This route is used to delete a class!
app.get('/watson/deleteclass/*', gets.deleteClass);

//This route is used to upload a picture and class it with custom classifiers
app.get('/watson/useclasses',gets.useClass);

//This route is used to upload a picture and for it to upload files and use watson to class with custom classes.
app.post('/class_upload',upload.single('file'), posts.class_upload);

//This route is going to be used for showing off the demo of the project!
app.get('/demo', gets.demo);

//This route is used to use to find faces in pictures.
app.get('/watson/faces', gets.faces);
//this route allows for a post method to upload a picture to watson and look at the faces.
app.post('/face_upload', upload.single('file') , posts.face);
//Create and run the local server.
var server = app.listen(8081,args[0], function(){
    var host = args[0];
    var port = server.address().port;
    console.log("Testing app listening at http://%s:%s\n",host,port)
});
