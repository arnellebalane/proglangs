var expect = require('expect.js');
var infix2postfix = require('../infix2postfix-converter');


describe('Infix-to-Postfix Converter', function() {
    it('should return the postfix string if second parameter (keep_tokens) is not given or false-y', function() {
        var given = '1 + 2 * 3';
        var actual = infix2postfix(given);
        expect(actual).to.be.a('string');
    });

    it('should return an array of labeled tokens if second parameter (keep_tokens) is set to true', function() {
        var given = '1 + 2 * 3';
        var expected = [
            { value: 1, type: 'operand' },
            { value: 2, type: 'operand' },
            { value: 3, type: 'operand' },
            { value: '*', type: 'operator' },
            { value: '+', type: 'operator' }
        ];
        var actual = infix2postfix(given, true);
        expect(actual).to.be.an(Array);
        expect(actual).to.eql(expected);
    });

    it('should convert "1 + 2" to "1 2 +"', function() {
        var given = '1 + 2';
        var expected = '1 2 +';
        var actual = infix2postfix(given);
        expect(actual).to.eql(expected);
    });

    it('should convert "1 + 2 * 3" to "1 2 3 * +"', function() {
        var given = '1 + 2 * 3';
        var expected = '1 2 3 * +';
        var actual = infix2postfix(given);
        expect(actual).to.eql(expected);
    });

    it('should convert "1 + 2 - 3 * 4" to "1 2 + 3 4 * -"', function() {
        var given = '1 + 2 - 3 * 4';
        var expected = '1 2 + 3 4 * -';
        var actual = infix2postfix(given);
        expect(actual).to.eql(expected);
    });

    it('should convert "1 / (2 + 3) * 4 - 5 % 6" to "1 2 3 + / 4 * 5 6 % -"', function() {
        var given = '1 / (2 + 3) * 4 - 5 % 6';
        var expected = '1 2 3 + / 4 * 5 6 % -';
        var actual = infix2postfix(given);
        expect(actual).to.eql(expected);
    });
});