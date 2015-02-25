var expect = require('expect.js');
var tokenize = require('../equation-tokenizer');


describe('Equation Tokenizer', function() {
    it('should always return an array of tokens', function() {
        var given = '1 + 2';
        var actual = tokenize(given);
        expect(actual).to.be.an(Array);
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

    it('should be able to tokenize without labels given equations containing parenthesis groupings', function() {
        var given = '1 * (2 + 3)';
        var expected = [1, '*', [2, '+', 3]];
        var actual = tokenize(given);
        expect(actual).to.eql(expected);
    });

    it('should be able to tokenize with labels given equations containing parenthesis groupings', function() {
        var given = '1 * (2 + 3)';
        var expected = [
            { value: 1, type: 'operand' },
            { value: '*', type: 'operator' },
            { value: [
                { value: 2, type: 'operand' },
                { value: '+', type: 'operator' },
                { value: 3, type: 'operand' }
            ], type: 'equation' }
        ];
        var actual = tokenize(given, true);
        expect(actual).to.eql(expected);
    });

    it('should be able to tokenize without labels given equations containing nested parenthesis groupings', function() {
        var given = '1 * (2 + 3 / (4 - 5)) + 6';
        var expected = [1, '*', [2, '+', 3, '/', [4, '-', 5]], '+', 6];
        var actual = tokenize(given);
        expect(actual).to.eql(expected);
    });

    it('should be able to tokenize with labels given equations containing nested parenthesis groupings', function() {
        var given = '1 * (2 + 3 / (4 - 5)) + 6';
        var expected = [
            { value: 1, type: 'operand' },
            { value: '*', type: 'operator' },
            { value: [
                { value: 2, type: 'operand' },
                { value: '+', type: 'operator' },
                { value: 3, type: 'operand' },
                { value: '/', type: 'operator' },
                { value: [
                    { value: 4, type: 'operand' },
                    { value: '-', type: 'operator' },
                    { value: 5, type: 'operand' },
                ], type: 'equation' },
            ], type: 'equation' },
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
});