var expect = require('expect.js');
var recognize = require('../equation-recognizer');


describe('Equation Recognizer', function() {
    it('should recognize "1 + 2 * 3"', function() {
        var given = '1 + 2 * 3';
        expect(recognize(given)).to.be(true);
    });

    it('should recognize "(1 + 2 * 3)"', function() {
        var given = '(1 + 2 * 3)';
        expect(recognize(given)).to.be(true);
    });

    it('should recognize "1 + (2 * 3)"', function() {
        var given = '1 + (2 * 3)';
        expect(recognize(given)).to.be(true);
    });

    it('should recognize "(1 + 2) * 3"', function() {
        var given = '(1 + 2) * 3';
        expect(recognize(given)).to.be(true);
    });

    it('should recognize "1 * (2 + (3 - 4 / (5 + 6 - 7) + 8) * 9) ^ 10"', function() {
        var given = '1 * (2 + (3 - 4 / (5 + 6 - 7) + 8) * 9) ^ 10';
        expect(recognize(given)).to.be(true);
    });

    it('should not recognize "()"', function() {
        var given = '()';
        function test() {
            recognize(given);
        }
        expect(test).to.throwException(/Invalid Statement/);
    });

    it('should not recognize "1 + (2 * 3))"', function() {
        var given = '1 + (2 * 3))';
        function test() {
            recognize(given);
        }
        expect(test).to.throwException(/Parenthesis Mismatched/);
    });

    it('should not recognize "1 + ((2 - 3)"', function() {
        var given = '1 + ((2 - 3)';
        function test() {
            recognize(given);
        }
        expect(test).to.throwException(/Parenthesis Mismatched/);
    });

    it('should not recognize "+ 1 + 2 - 3"', function() {
        var given = '+ 1 + 2 - 3';
        function test() {
            recognize(given);
        }
        expect(test).to.throwException(/Invalid Statement/);
    });

    it('should not recognize "1 + + 2 - 3"', function() {
        var given = '1 + + 2 - 3';
        function test() {
            recognize(given);
        }
        expect(test).to.throwException(/Invalid Statement/);
    });
});
