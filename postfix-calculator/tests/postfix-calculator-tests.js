var expect = require('expect.js');
var calculate = require('../postfix-calculator');


describe('Postfix Calculator', function() {
    it('should evaluate a postfix equation given as a string', function() {
        var given = '1 2 3 * +';
        var expected = 7;
        var actual = calculate(given);
        expect(actual).to.be(expected);
    });

    it('should evaluate a postfix equation given as an array of labeled tokens', function() {
        var given = [
            { value: 1, type: 'operand' },
            { value: 2, type: 'operand' },
            { value: 3, type: 'operand' },
            { value: '*', type: 'operator' },
            { value: '+', type: 'operator' },
        ];
        var expected = 7;
        var actual = calculate(given);
        expect(actual).to.be(expected);
    });

    it('should throw an error if postfix equation is invalid due to missing operands', function() {
        function test() {
            calculate('1 2 * +');
        }
        expect(test).to.throwException(/Invalid Postfix Statement/);
    });

    it('should throw an error if postfix equation is invalid due to excess operators', function() {
        function test() {
            calculate('1 2 3 *');
        }
        expect(test).to.throwException(/Invalid Postfix Statement/);
    });

    it('should evaluate "1 2 3 + / 4 * 5 6 % -" to "-4.2"', function() {
        var given = '1 2 3 + / 4 * 5 6 % -';
        var expected = -4.2;
        var actual = calculate(given);
        expect(actual).to.eql(expected);
    });

    it('should evaluate "2 3 ^ 3 %" to "2"', function() {
        var given = '2 3 ^ 3 %';
        var expected = 2;
        var actual = calculate(given);
        expect(actual).to.eql(expected);
    });

    it('should evaluate "3 2 * 1 +" to "7"', function() {
        var given = '3 2 * 1 +';
        var expected = 7;
        var actual = calculate(given);
        expect(actual).to.eql(expected);
    });

    it('should evaluate "65 3 5 * + 83 -" to "-3"', function() {
        var given = '65 3 5 * + 83 -';
        var expected = -3;
        var actual = calculate(given);
        expect(actual).to.eql(expected);
    });

    it('should throw an error for "6 5 3 * + 8 3 - + 3"', function() {
        function test() {
            calculate('6 5 3 * + 8 3 - + 3');
        }
        expect(test).to.throwException(/Invalid Postfix Statement/);
    });
});