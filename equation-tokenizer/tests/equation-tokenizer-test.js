var expect = require('expect.js');
var tokenize = require('../equation-tokenizer');


describe('Equation Tokenizer', function() {
    it('tokenizing should return an array of tokens', function() {
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
        var actual = tokenize(given);
        expect(actual).to.eql(expected);
    });

    it('tokenizing "12 + (23 - 34) * 45 / 56" without labels should return [12, +, [23, -, 34], *, 45, /, 56]', function() {
        var given = '12 + (23 - 34) * 45 / 56';
        var expected = [12, '+', [23, '-', 34], '*', 45, '/', 56];
        var actual = tokenize(given);
        expect(actual).to.eql(expected);
    });

    it('tokenizing "12+(23-34)*45/56" (no spaces) without labels should return [12, +, [23, -, 34], *, 45, /, 56]', function() {
        var given = '12+(23-34)*45/56';
        var expected = [12, '+', [23, '-', 34], '*', 45, '/', 56];
        var actual = tokenize(given);
        expect(actual).to.eql(expected);
    });

    it('tokenizing "12 + (23 - 34) * 45 / 56" with labels should return properly labeled tokens', function() {
        var given = '12 + (23 - 34) * 45 / 56';
        var expected = [
            { value: 12, type: 'operand' },
            { value: '+', type: 'operator' },
            { value: [
                { value: 23, type: 'operand' },
                { value: '-', type: 'operator' },
                { value: 34, type: 'operand' }
            ], type: 'equation' },
            { value: '*', type: 'operator' },
            { value: 45, type: 'operand' },
            { value: '/', type: 'operator' },
            { value: 56, type: 'operand' }
        ];
        var actual = tokenize(given, true);
        expect(actual).to.eql(expected);
    });

    it('tokenizing "12+(23-34)*45/56" (no spaces) with labels should return properly labeled tokens', function() {
        var given = '12+(23-34)*45/56';
        var expected = [
            { value: 12, type: 'operand' },
            { value: '+', type: 'operator' },
            { value: [
                { value: 23, type: 'operand' },
                { value: '-', type: 'operator' },
                { value: 34, type: 'operand' }
            ], type: 'equation' },
            { value: '*', type: 'operator' },
            { value: 45, type: 'operand' },
            { value: '/', type: 'operator' },
            { value: 56, type: 'operand' }
        ];
        var actual = tokenize(given, true);
        expect(actual).to.eql(expected);
    });
});