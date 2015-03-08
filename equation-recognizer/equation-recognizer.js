(function(root, definition) {
    if (typeof define === 'function' && define.amd) {
        define(['../equation-tokenizer/equation-tokenizer'], definition);
    } else if (typeof exports === 'object') {
        var tokenize = require('../equation-tokenizer/equation-tokenizer');
        module.exports = definition(tokenize);
    } else {
        root.recognize_equation = definition(root.tokenize_equation);
    }
})(this, function(tokenize) {
    function EquationRecognizer(tokens) {
        this.tokens = tokens;
        if (typeof tokens === 'string') {
            this.tokens = tokenize(tokens, true);
        }
        this.index = 0;
    }

    EquationRecognizer.prototype._expect = function(token) {
        if (this._next() === token || this._next().value === token) {
            this._consume();
        } else {
            this._error();
        }
    };

    EquationRecognizer.prototype._error = function() {
        throw new Error('Invalid Statement.');
    };

    EquationRecognizer.prototype._next = function() {
        return this.tokens[this.index];
    };

    EquationRecognizer.prototype._consume = function() {
        this.index++;
    };

    EquationRecognizer.prototype._p = function() {
        var next = this._next();
        if (next.type === 'operand') {
            this._consume();
        } else if (next.type === 'group' && next.value === '(') {
            this._consume();
            this._e();
            this._expect(')');
        } else {
            this._error();
        }
    };

    EquationRecognizer.prototype._e = function() {
        this._p();
        while (this._next() && this._next().type === 'operator') {
            this._consume();
            this._p();
        }
    };

    EquationRecognizer.prototype.recognize = function() {
        this._e();
        this._expect(undefined);
        return true;
    };


    function recognize(tokens) {
        var recognizer = new EquationRecognizer(tokens);
        return recognizer.recognize();
    }


    return recognize;
});
