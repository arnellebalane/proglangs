var expect = require('expect.js');
var tokenize = require('../equation-tokenizer');


describe('Equation Tokenizer', function() {
    it('should always return an array of tokens', function() {
        var given = '1 + 2';
        var actual = tokenize(given);
        expect(actual).to.be.an('array');
    });

    it('should be able to tokenize without labels given equations with single-digit values', function() {
        var given = '1 + 2';
        var expected = [1, '+', 2];
        var actual = tokenize(given);
        expect(actual).to.eql(expected);
    });

    it('should be able to tokenize with labels given equations with single-digit values', function() {
        var given = '1 + 2';
        var expected = [
            { value: 1, type: 'operand' },
            { value: '+', type: 'operator' },
            { value: 2, type: 'operand' }
        ];
        var actual = tokenize(given, true);
        expect(actual).to.eql(expected);
    });

    it('should be able to tokenize without labels given equations with multi-digit values', function() {
        var given = '12 + 23';
        var expected = [12, '+', 23];
        var actual = tokenize(given);
        expect(actual).to.eql(expected);
    });

    it('should be able to tokenize with labels given equations with multi-digit values', function() {
        var given = '12 + 23';
        var expected = [
            { value: 12, type: 'operand' },
            { value: '+', type: 'operator' },
            { value: 23, type: 'operand' }
        ];
        var actual = tokenize(given, true);
        expect(actual).to.eql(expected);
    });

    it('should be able to tokenize without labels given equations with decimal values', function() {
        var given = '12 + 23.34';
        var expected = [12, '+', 23.34];
        var actual = tokenize(given);
        expect(actual).to.eql(expected);
    });

    it('should be able to tokenize with labels given equations with decimal values', function() {
        var given = '12 + 23.34';
        var expected = [
            { value: 12, type: 'operand' },
            { value: '+', type: 'operator' },
            { value: 23.34, type: 'operand' }
        ];
        var actual = tokenize(given, true);
        expect(actual).to.eql(expected);
    });

    it('should be able to tokenize without labels given equations containing variable names', function() {
        var given = 'a + b2 * _c4';
        var expected = ['a', '+', 'b2', '*', '_c4'];
        var actual = tokenize(given);
        expect(actual).to.eql(expected);
    });

    it('should be able to tokenize with labels given equations containing variable names', function() {
        var given = 'a + b2 * _c4';
        var expected = [
            { value: 'a', type: 'operand' },
            { value: '+', type: 'operator' },
            { value: 'b2', type: 'operand' },
            { value: '*', type: 'operator' },
            { value: '_c4', type: 'operand' }
        ];
        var actual = tokenize(given, true);
        expect(actual).to.eql(expected);
    });

    it('should be able to tokenize without labels given equations containing parenthesis groupings', function() {
        var given = '1 * (2 + 3)';
        var expected = [1, '*', '(', 2, '+', 3, ')'];
        var actual = tokenize(given);
        expect(actual).to.eql(expected);
    });

    it('should be able to tokenize with labels given equations containing parenthesis groupings', function() {
        var given = '1 * (2 + 3)';
        var expected = [
            { value: 1, type: 'operand' },
            { value: '*', type: 'operator' },
            { value: '(', type: 'group' },
            { value: 2, type: 'operand' },
            { value: '+', type: 'operator' },
            { value: 3, type: 'operand' },
            { value: ')', type: 'group' },
        ];
        var actual = tokenize(given, true);
        expect(actual).to.eql(expected);
    });

    it('should be able to tokenize without labels given equations containing nested parenthesis groupings', function() {
        var given = '1 * (2 + 3 / (4 - 5)) + 6';
        var expected = [1, '*', '(', 2, '+', 3, '/', '(', 4, '-', 5, ')', ')', '+', 6];
        var actual = tokenize(given);
        expect(actual).to.eql(expected);
    });

    it('should be able to tokenize with labels given equations containing nested parenthesis groupings', function() {
        var given = '1 * (2 + 3 / (4 - 5)) + 6';
        var expected = [
            { value: 1, type: 'operand' },
            { value: '*', type: 'operator' },
            { value: '(', type: 'group' },
            { value: 2, type: 'operand' },
            { value: '+', type: 'operator' },
            { value: 3, type: 'operand' },
            { value: '/', type: 'operator' },
            { value: '(', type: 'group' },
            { value: 4, type: 'operand' },
            { value: '-', type: 'operator' },
            { value: 5, type: 'operand' },
            { value: ')', type: 'group' },
            { value: ')', type: 'group' },
            { value: '+', type: 'operator' },
            { value: 6, type: 'operand' }
        ];
        var actual = tokenize(given, true);
        expect(actual).to.eql(expected);
    });

    it('should throw an error if the parentheses in the given equation are mismatched', function() {
        var open = function() {
            tokenize('1 * (2 + 3 / 4');
        };
        var close = function() {
            tokenize('1 * 2 + 3) / 4');
        };
        expect(open).to.throwException(/Parenthesis Mismatched/);
        expect(close).to.throwException(/Parenthesis Mismatched/);
    });

    it('should be able to tokenize equations that do not contain spaces', function() {
        var given = '1*(2+3)';
        var expected = [1, '*', '(', 2, '+', 3, ')'];
        var actual = tokenize(given);
        expect(actual).to.eql(expected);
    });

    it('should be able to tokenize without labels given equations in postfix format', function() {
        var given = '1 2 3 * +';
        var expected = [1, 2, 3, '*', '+'];
        var actual = tokenize(given);
        expect(actual).to.eql(expected);
    });

    it('should be able to tokenize with labels given equations in postfix format', function() {
        var given = '1 2 3 * +';
        var expected = [
            { value: 1, type: 'operand' },
            { value: 2, type: 'operand' },
            { value: 3, type: 'operand' },
            { value: '*', type: 'operator' },
            { value: '+', type: 'operator' },
        ];
        var actual = tokenize(given, true);
        expect(actual).to.eql(expected);
    });

    it('should be able to tokenize and label the modulo operator from a given equation', function() {
        var given = '1 * 2 % 3';
        var expected = [
            { value: 1, type: 'operand' },
            { value: '*', type: 'operator' },
            { value: 2, type: 'operand' },
            { value: '%', type: 'operator' },
            { value: 3, type: 'operand' }
        ];
        var actual = tokenize(given, true);
        expect(actual).to.eql(expected);
    });

    it('should be able to tokenize and label the caret (exponent) operator from a given equation', function() {
        var given = '1 + 2 ^ 3';
        var expected = [
            { value: 1, type: 'operand' },
            { value: '+', type: 'operator' },
            { value: 2, type: 'operand' },
            { value: '^', type: 'operator' },
            { value: 3, type: 'operand' }
        ];
        var actual = tokenize(given, true);
        expect(actual).to.eql(expected);
    });
});