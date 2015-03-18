var expect = require('expect.js');
var tokenize = require('../code-tokenizer');


describe('Code Tokenizer', function() {
    it('should recognize reserved keywords as tokens', function() {
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

    it('should recognize datatypes as tokens', function() {
        var given = '#include<stdio.h>\nint main(void) {\nif (1 > 0) {\nswitch (1) {\ncase 1: return 12; break;\ndefault: return 12;\n}\n} else {\nreturn 24;\n}\n}';
        var tokens = tokenize(given);
        expect(tokens[6]).to.eql({ label: 'DATATYPE', token: 'int' });
        expect(tokens[10]).to.eql({ label: 'DATATYPE', token: 'void' });
    });

    it('should recognize identifiers as tokens', function() {
        var given = '#include<stdio.h>\nint main(void) {\nint a = 1, b = 2;\nif (1 > 0) {\nswitch (1) {\ncase 1: return 12; break;\ndefault: return 12;\n}\n} else {\nreturn 24;\n}\n}';
        var tokens = tokenize(given);
        expect(tokens[1]).to.eql({ label: 'IDENTIFIER', token: 'include' });
        expect(tokens[8]).to.eql({ label: 'IDENTIFIER', token: 'main' });
        expect(tokens[17]).to.eql({ label: 'IDENTIFIER', token: 'a' });
        expect(tokens[24]).to.eql({ label: 'IDENTIFIER', token: 'b' });
    });
});
