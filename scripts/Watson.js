var watson = require('watson-developer-cloud');
var fs = require('fs');
var helper = require('./helpers');

var visual_recognition = null;
//this function is called when a picture is uploaded and needs to be classed
//picture is the file name while pictureJSON is the file name with .json not .png or .jpg
exports.createJSON = function(picture,pictureJSON){
    var dir = helper.getDir() + '/uploads/';
    
    var param = {
        images_file: fs.createReadStream(dir + picture)
    };
    visual_recognition.classify(param, function(err, res){
        if(err)
            console.log(err);
        else
        {
            console.log(JSON.stringify(res,null,2));
            //create a new json file that is the classification of the picture that was sent
            var file = helper.getDir() + 'json/' + pictureJSON;
            fs.writeFile(file, JSON.stringify(res,null,2), function(err){
                if(err)
                    console.log(err);
                else{
                    console.log('json file written!');
                }
            });
        }
    });
};
//This function is used to create classes with watson
//filesArray is the array of zip files to
//className is the name of the class that is going to be created
exports.classify = function(filesArray,className,type) {
    var dir = helper.getDir() + '/uploads/';
    var posNegArray = null;
    if(type == ("ppp"))
        posNegArray = ["_positive_examples", "_positive_examples", "_positive_examples"];
    else
        posNegArray = ["_positive_examples", "_positive_examples", "_negative_examples"];

    console.log(posNegArray);
    var params =
        {
            name: className,
        };
    //fill the params object with examples and the file system.
    for (i = 0; i < filesArray.length; i++) {
        //fileName is the name of the file
        var fileName = filesArray[i].originalname;
        //paramName is the file name without the file extention name
        var paramName = fileName.substring(0, fileName.length - 4);
        //keyName is the name of the key value to be pushed to the object
        var keyName = paramName + posNegArray[i];
        //keyValue is the file location of the zip file.
        console.log(keyValue);
        console.log(keyName);
        var keyValue = helper.getDir() + 'class_zip/' + filesArray[i].originalname;
        params[keyName] = fs.createReadStream(keyValue);

    };
    visual_recognition.createClassifier(params,
        function (err, response) {
            if (err)
                console.log(err);
            else{
                console.log(JSON.stringify(response, null, 2));
                createClassList();
            };
        });
};
//Call to this function creates a class list and saves it in a __classes.json file
var createClassList = function(){
    var dir = helper.getDir() + '/uploads/';
    visual_recognition.listClassifiers({},
        function(err, response) {
            if (err)
                console.log(err);
            else{
                //create a json file of all the id of the classes for later use
                var file = helper.getDir() +'json/' + '__classes.json';
                var writedata = [];
                fs.writeFile(file,JSON.stringify(response,null,2),function(err){
                    if(err)
                        console.log(err);

                });

            };
        });
};
//create a method name to call outside of function.
exports.updateClassList = createClassList;
//This function will delete a class
//ClassID is the class id of the classification that is going to be deleted.
exports.deleteClass = function(classID){
    var dir = helper.getDir() + '/uploads/';

    visual_recognition.deleteClassifier({classifier_id: classID },
        function(err, response) {
            if (err)
                console.log(err);
            else
                console.log(JSON.stringify(response, null, 2));
        });
    createClassList();
};
//update the api key fun this function in the start of the program!
exports.apiKey = function(apiKey){
    visual_recognition = watson.visual_recognition({
    api_key: apiKey,
    version_date: '2016-05-20',
    version: 'v3'
    });
};
//call this function when you want to use a custom classification. 
exports.customClassify = function(file, classId){
    var dir = helper.getDir() + '/uploads/';
    var file = file;
    var param = {
        images_file: fs.createReadStream(dir + file.originalname),
        classifier_ids: [classId],
        threshold: 0.0
    };
    visual_recognition.classify(param, function(err, res){
        if(err)
            console.log(err);
        else
        {
            console.log(JSON.stringify(res,null,2));
            //create a new json file that is the classification of the picture that was sent
            var loc = helper.getDir() +'json/' + file.originalname.substring(0,file.originalname.length - 4) + '.json';
            fs.writeFile(loc, JSON.stringify(res,null,2), function(err){
                if(err)
                    console.log(err);
                else{
                    console.log('json file written!');
                }
            });
        }
    });

};
//This function is called when a user wants Watson to classify a picture with a face
exports.classifyFaces = function(file){
    var dir = helper.getDir() + '/uploads/';
    var file = file;
    var pictureJSON = file.originalname.substring(0,file.originalname.length - 4) + '.json';
    //Create the params for watson to read.
    var params = {
        //link the file name that will be sent to Watson
        images_file: fs.createReadStream(dir + file.originalname)
    };
    //Call watson and send him the params we created above.
    visual_recognition.detectFaces(params, function(err, res){
        if(err)
            console.log(err);
        else
        {
            console.log(JSON.stringify(res,null,2));
            //create a new json file that is the classification of the picture that was sent
            var file = helper.getDir() + 'json/' + pictureJSON;
            //write the JSON file to the local file system to be used later. 
            fs.writeFile(file, JSON.stringify(res,null,2), function(err){
                if(err)
                    console.log(err);
                else{
                    console.log('json file written!');
                }
            });
        }
    });
};