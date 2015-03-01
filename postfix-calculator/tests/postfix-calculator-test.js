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
});