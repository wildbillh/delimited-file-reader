/**
 * Created by HODGESW on 5/10/2017.
 */
"use strict";

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

fileReader.parse('./simple-example.txt');

// comment: # Example file using comma delimited format with comments
// data: {"field_0":"value1-1","field_1":"value2-2"}
// data: {"field_0":"value2-1","field_1":"value2-2"}
// Elvis has left the building!
