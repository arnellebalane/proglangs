var expect = require('expect.js');
var tokenize = require('../code-tokenizer');


describe('Code Tokenizer', function() {
    it('should recognize as tokens reserved keywords', function() {
        var given = '#include<stdio.h>\nint main(void) {\nif (1 > 0) {\nswitch (1) {\ncase 1: return 12; break;\ndefault: return 12;\n}\n} else {\nreturn 24;\n}\n}';
        var tokens = tokenize(given);
        expect(tokens[15]).to.eql({ label: 'KEYWORD', token: 'if' });
        expect(tokens[27]).to.eql({ label: 'KEYWORD', token: 'switch' });
        expect(tokens[35]).to.eql({ label: 'KEYWORD', token: 'case' });
        expect(tokens[40]).to.eql({ label: 'KEYWORD', token: 'return' });
        expect(tokens[45]).to.eql({ label: 'KEYWORD', token: 'break' });
        expect(tokens[48]).to.eql({ label: 'KEYWORD', token: 'default' });
        expect(tokens[60]).to.eql({ label: 'KEYWORD', token: 'else' });
    });
});
