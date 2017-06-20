var fs = require('fs');
var watson = require('./Watson');
var helper = require('./helpers');
//var watson = require('Watson');
//Hello world function is called when no url is found
exports.helloWorld = function helloWorld(req,res){
    res.send('Hello, World!');
};
//index function that sends the index file to the user when 'index.html' is called
exports.index = function index(req,res){
    res.sendFile(helper.getDir() + 'html/index.html');
};
//get function when /watson is called
exports.watson_path = function watson_path(req,res){
    var dir = helper.getDir() + "uploads";
    var style = 'style="width:128px;height:128px;"';
    var writer = '';
    res.write('<!doctype html>');
    fs.readdir(dir,function(err, files){
        //create a html page that allows for picutres uploaded to be clicked and classifyed by watson
       for(i = 0; i < files.length; i++){
           writer += ('<a href= "/watson/' + files[i] + '">');
           writer += ('<img src="/' + files[i] + '" ' + style + ' >');
           writer += ('</a>');
       };
       //write the page to the user and end the response
       res.write(writer)
       res.end();
    });
};
//sends a file to watson and watson returns information about the picture
exports.watson_read = function watson_read(req,res){
    var dir = helper.getDir() + 'json/';
    var picture = req.url.substring(8,req.url.length);
    var pictureJSON = picture.substring(0,picture.length - 4) + '.json';
    var exists = false;
    //Look into this directory to see if there is a file that matches the name requested
    fs.readdir(dir,function(err,files) {
        if(err)
            console.log(err);
        else {
            //check if there is a matching file name
            for (i = 0; i < files.length; i++) {
                if (pictureJSON == files[i]) {
                    exists = true;
                    console.log('File Found!');
                    break;
                };
            };
            // if there is a matching name send the user the json file
            if (exists) {
                fs.readFile((dir + pictureJSON), function (err, data) {
                    if (err)
                        console.log(err);
                    else
                        res.write(data);
                    res.end()
                });
            }
            //if there is not a matching name create a json file and link them back to the watson page!
            else {
                watson.createJSON(picture, pictureJSON);
                res.write('<!doctype html>');
                res.write('No JSON file found creating one for you!');
                res.write('<a href="/watson/"> <p>go back</p></a>');
                res.end();
            };
        };
    });
};
//This function is used to mess with watsons custom classification
exports.classify = function classify(req,res){
    res.sendFile(helper.getDir() + 'html/classify.html');
};
//this function is called to list all of the classes
exports.listClasses = function classes(req,res){
    watson.updateClassList();
    var file = helper.getDir() + 'json/__classes.json';
    //use this for time out since we want to wait for it to load.
    var tester = function() {
        fs.readFile(file, 'utf8', function (err, data) {
            if (err)
                console.log(err);
            else {
                var json = JSON.parse(data);
                var writer = '<!doctype html>';
                //create the writer to make the html page that will allow people to view the classes and delete them!
                for (i = 0; i < json.classifiers.length; i++) {
                    writer += '<div><p>className: ' + json.classifiers[i].name + '<br/> classID: '
                        + json.classifiers[i].classifier_id + '<br/> status: ' + json.classifiers[i].status +
                        '<br/><a href="/watson/deleteclass/' + json.classifiers[i].classifier_id + '/">Delete</a> '
                        + '<a href="/watson/useclasses/">Use</a></p></div>';
                };
                res.write('<h1>List of Classes: </h1>');
                res.write(writer);
                res.end();
            }
        });
    };
    setTimeout(tester,3000);
};
//delete a watson class
exports.deleteClass = function(req,res){
    var classID = req.url.substring(20,req.url.length - 1);
    console.log(classID);
    watson.deleteClass(classID);
    res.write('<!doctype html>');
    res.write('Class deleted!');
    res.write('<a href="/watson/classes"> <p>go back</p></a>');
    res.end();
};
//This is used to create a form that will allow users to upload pictures with using custom classifiers
exports.useClass = function(req,res){
    watson.updateClassList();
    var file = helper.getDir() + 'json/__classes.json';
    //use this for time out since we want to wait for it to load.
    var tester = function() {
        fs.readFile(file, 'utf8', function (err, data) {
            if (err)
                console.log(err);
            else {
                //Here we create a HTMl page with a writer.
                var json = JSON.parse(data);
                var writer = '<!doctype html>';
                writer += ('<h1>Upload a Picture!</h1>');
                writer += '<form action = "http://127.0.0.1:8081/class_upload" method = "POST" enctype = "multipart/form-data">'
                writer += '<input type="file" name="file" size="50" /><br>';
                writer += '<h3> Pick a Classifier</h3>';
                for (i = 0; i < json.classifiers.length; i++) {
                    writer += '<input type="radio" name="class" value="' + json.classifiers[i].classifier_id + '">'
                        + json.classifiers[i].name +'<br>';
                };
                writer += '<input type = "submit" value = "Upload File" />';

                res.write(writer);
                res.end();
            }
        });
    };
    setTimeout(tester,3000);

};
//This function is used for the presentation demo!
exports.demo = function(req,res){
    res.sendFile( helper.getDir() + 'html/demo.html');
};
//Send the file to the user so they can upload a picture to the server to have it processed by Watson
exports.faces = function(req,res){
     res.sendFile(helper.getDir() + 'html/faces.html');
};