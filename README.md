#DelimitedFileReader
[![Build Status](https://travis-ci.org/wildbillh/delimited-file-reader.svg?branch=master)](https://travis-ci.org/wildbillh/delimited-file-reader)[![Inline docs](http://inch-ci.org/github/wildbillh/delimited-file-reader.svg?branch=master)](http://inch-ci.org/github/wildbillh/delimited-file-reader)[![npm version](https://badge.fury.io/js/delimited-file-reader.svg)](https://badge.fury.io/js/delimited-file-reader)

_A promise enabled, ES6 Class for reading delimited text files and 
emitting the records as objects._  

##Synopsis

Read the given file, listen to the various events to get the data:

```javascipt
const DelimitedFileReader = require('../lib/delimited-file-reader');

let fileReader = new DelimitedFileReader(',');

fileReader.on('comment', (comment) => {
    console.log(`comment: ${comment}`);
});

fileReader.on('data', (data) => {
    console.log(`data: ${JSON.stringify(data)}`);
});

fileReader.on('close', () => {
    console.log('Elvis has left the building!');
});

fileReader.parse('./simple-example.csv');

// comment: # Example file using comma delimited format with comments
// data: {"field_0":"value1-1","field_1":"value2-2"}
// data: {"field_0":"value2-1","field_1":"value2-2"}
// Elvis has left the building!
```

This code comes from the provided example file: [simple-example.js](examples/simple-example.js) 


##Description

This class is a simple implementation of a delimited text file reader.
The following are configurable.
<ul>
<li>column delimiter - Any string or regular expression can be configured</li>
<li>field names - Define the property names for each column or let the class name it. The class uses the naming convention field_${col_index}.</li>
<li>comment delimter - Define a string when found at the beginning of a line, defines the line as a comment. This feature can be disabled.</li>
</ul>


**In simpler terms:** 
* I have a delimited text file with lf or lf\cr as record delimiters. 
* The column delimiter can be expressed as a string or regular expresssion.
* They're may be comments in the file using a defined string in the starting position.
* I want to read the file and process each record as an object.
* I may want to name the properties of each object or I may let the class name them. 


##Project Features
* ES6 Class
* Promise enabled
* Complete test coverage with Mocha and Chai
* JSDoc generated API documentation
* Rest parameters are used for maximum flexibility.

##Installation
npm install delimited-file-reader --save

Git Repository: https://github.com/wildbillh/delimited-file-reader

##Documentation


There is JSDOC documentation provided: [DelimitedFileReader.html](doc/DelimitedFileReader.html)

##Methods

###Constructor
```javascipt
constructor(delimiter = /[,]/, fields = [], commentChar = '#')
```
The constructor takes three defaulted parameters:
1. delimiter - defaults to a common. Can be any valid string or regular expresssion.
2. fields - defaults to an empty array. In this case, the class will generated 
field names. The user can also supply an array of strings. 
3. commentChar - The string to use to designate a comment line (if it occurs at position 0).
Set this to null of the feature should be disabled.

###parse
```javascipt
parse(filename)
```
This method starts the process of reading the files and emitting events.
Prior to calling this method, the desired event listeners should be 
instantiated. 

##Events
* close - File reading is complete and all records have been emitted.
* comment - A comment was encountered. The entire line is returned.
* data - Contains an object representing the record.
* error - Contains the error message.
* invalid - A record was encountered with the wrong number of fields. 
This can only occur if the user specifies field names. The entire line is returned.

##### Author: Bill Hodges