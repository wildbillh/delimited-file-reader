
"use strict";
let assert = require('chai').assert;

let DelimitedFileReader = require('../lib/delimited-file-reader');

describe('DelimitedFileReader Tests', function () {

    let fr = new DelimitedFileReader();

    it("an invalid filename should cause the parse function to reject", function () {
        return fr.parse('blah')
        .then( () => {
            assert.fail('resolved','rejected', 'should not have resolved');
        })
        .catch ( () => {
            assert.isTrue(true, 'rejects as expected');
        });
    });

    it("a valid,readable filename should cause the parse function to resolve", function () {
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



});