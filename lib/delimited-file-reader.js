/**
 * Created by HODGESW on 5/10/2017.
 */

"use strict";

const EventEmitter = require('events');
const readline = require('readline');
const fs = require('fs');

/**
 * A simple class for reading a delimited text file and output-ing each record as an object.
 * With the constructor the user can specify:
 * <ol>
 *     <li>The column delimiter.</li>
 *     <li>The name of the fields to be applied to each column in the returned object.</li>
 *     <li>A starting character to be interpreted as a comment.</li>
 * </ol>
 * This class is an emitter. The following events are emitted:
 * <ul>
 *      <li>close - File reading is complete and all records have been emitted.</li>
 *      <li>comment - A comment was encountered. The entire line is returned.</li>
 *      <li>data - Contains an object representing the record.</li>
 *      <li>error - Contains the error message.</li>
 *      <li>invalid - A record was encountered with the wrong number of fields. The line is returned</li>
 *
 * </ul>
 *
 * @class
 * @extends EventEmitter
 */
class DelimitedFileReader extends EventEmitter {

    /**
     * Constructor. Sets the delimiter, column names and comment character
     * @param {regex} [delimiter=/[,]/] Regex delimiter used to separate fields
     * @param {string[]} [fields=[]] Array of Field names to apply to the fields
     * @param {string} [commentChar='#'] Character to indicate a comment, when found in first position
     */
    constructor(delimiter = /[,]/, fields = [], commentChar = '#') {
        super();
        // If an array is passed to the constructor store it

        this.delimiter = delimiter;
        this.fields = (Array.isArray(fields)) ? fields : [];
        this.commentChar = commentChar;
        this.numberOfValidRecords = 0;
        this.numberOfInvalidRecords = 0;
        this.numberOfComments = 0;

    }

    /**
     * Parse the given filename. Prior to this call the user has subscribed to
     * the various events. If the promise is resolved, the reading will begin.
     * @param {string} filename - File to parse
     * @returns {Promise} If the file is opened successfully the promise is resolved.
     */
    parse (filename) {
        return new Promise( (resolve, reject) => {
            let rl = null;
            this.getStreamFromFile(filename, true)
            .then( (stream) => {
                this.inputStream = stream;
                return (stream);
            })
            .then ( (stream) => {
                rl = readline.createInterface({
                    input: stream
                });

                rl.on('line', (line) => {
                    this.processLine(line);
                });

                rl.on('close', () => {
                    let statsObject = {
                        records: this.numberOfValidRecords,
                        comments: this.numberOfComments,
                        errors: this.numberOfInvalidRecords
                    };
                    this.emit('close', statsObject);
                });

                rl.on('error', (err) => {
                    this.emit('error', err);
                });

                return resolve(stream);
            })
            .catch((err) => {
                return reject(err);
            })
        });
    }

    /**
     * @private
     * Internal function to open a file
     * @param filename
     * @param isRead
     * @param streamOptions
     * @returns {Promise}
     */
    getStreamFromFile(filename, isRead = true, streamOptions) {
        return new Promise((resolve, reject) => {
            let stream = null;

            stream = isRead ? fs.createReadStream(filename, streamOptions) : fs.createWriteStream(filename, streamOptions);

            stream.on('error', (err) => {
                return reject(err.toString());
            });

            stream.on('open', () => {
                return resolve(stream);
            })

        });
    }


    /**
     * @private
     * Internal function used to split each line into an object
     * @param line
     */
    processLine (line) {
        // Send a comment event if it's a comment
        if (line.charAt(0) === this.commentChar) {
            this.numberOfComments++;
            this.emit('comment', line);
            return;
        }

        let returnObject = {};

        let splitArray = line.split(this.delimiter);
        // If the fields have been defined but we don't have the correct number
        if (this.fields.length > 0) {
            if (this.fields.length !== splitArray.length ) {
                this.numberOfInvalidRecords++;
                this.emit('invalid', line, splitArray);
            }
            else {
                this.fields.forEach((fieldName, index) => {
                    returnObject[fieldName] = splitArray[index];
                });
                this.numberOfValidRecords++;
                this.emit('data', returnObject);
            }
        }
        else {
            // we have to generate field names
            splitArray.forEach( (element, index) => {
                returnObject[`field_${index}`] = splitArray[index];
            });
            this.numberOfValidRecords++;
            this.emit('data', returnObject);
        }

    }



}

module.exports = DelimitedFileReader;