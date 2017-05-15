
"use strict";
let assert = require('chai').assert;

let DelimitedFileReader = require('../lib/delimited-file-reader');

describe('DelimitedFileReader Tests', function () {



    it("an invalid filename should cause the parse function to reject", function () {
        let fr = new DelimitedFileReader();
        return fr.parse('blah')
        .then( () => {
            assert.fail('resolved','rejected', 'should not have resolved');
        })
        .catch ( () => {
            assert.isTrue(true, 'rejects as expected');
        });
    });

    it("a valid,readable filename should cause the parse function to resolve", function () {
        let fr = new DelimitedFileReader();
        fr.on('comment', (comment) => {
            assert.equal(comment, '# This is a single row test file');
        });
        fr.on('data', (data) => {
            assert.equal(data.field_0, 'blah1');
        });

        return fr.parse('./test/single-row-test-file.txt')
        .then( () => {
            assert.isTrue(true, 'resolved as expected');
        })
        .catch ( () => {
            assert.fail('resolved','rejected', 'should not have rejected');
        });
    });

    it("If number of columns matches definition, normal data event is thrown", function (done) {
        let fr = new DelimitedFileReader(',', ['f1', 'f2']);
        fr.on('invalid', () => {
            assert.equal(1, 2, 'Invalid event was thrown');
            done();
        });
        fr.on('data', () => {
            assert.equal(1,1, 'Data event thrown as expected');
            done();
        });

        fr.parse('./test/single-row-test-file.txt')
        .then( () => {
        })
        .catch ( () => {
            assert.fail('resolved','rejected', 'should not have rejected');
            done();
        });
    });

    it("If number of columns does not match given definition, invalid event is called", function (done) {
        let fr = new DelimitedFileReader(',', ['f1', 'f2', 'f3']);
        fr.on('invalid', () => {
            assert.isTrue(true, 'Invalid event was thrown as expected');
            done();
        });
        fr.on('data', () => {
            assert.fail('Data event should not have been thrown');
            done();
        });

        fr.parse('./test/single-row-test-file.txt')
        .then( () => {
        })
        .catch ( () => {
            assert.fail('resolved','rejected', 'should not have rejected');
        });
    });

    it("If a comment character is included, the comment should be found", function (done) {
        let fr = new DelimitedFileReader(',', ['f1', 'f2'], '#');
        fr.on('comment', () => {
            assert.isTrue(true, 'Comment event was thrown as expected');
            done();
        });
        fr.on('data', () => {
            assert.fail('Data event should not have been thrown');
            done();
        });

        fr.parse('./test/single-row-test-file.txt')
        .then( () => {
        })
        .catch ( () => {
            assert.fail('resolved','rejected', 'should not have rejected');
        });
    });



});