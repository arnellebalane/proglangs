(function(root, definition) {
    if (typeof define === 'function' && define.amd) {
        define([], definition);
    } else if (typeof exports === 'object') {
        module.exports = definition();
    } else {
        root.tokenize_code = definition();
    }
})(this, function() {
    function TokenizedCode(code) {
        code = code.split('');
        var tokens = [];
        var index = 0;
        var flags = { STRING: false };

        while (index < code.length) {
            var current = code[index];
            if (this.letter(current)) {
                var i = index;
                while (this.alphanumeric(code[i]) || flags.STRING) {
                    i++;
                    if (flags.STRING && flags.STRING === code[i]) {
                        break;
                    }
                }
                tokens.push(code.slice(index, i).join(''));
                index = i - 1;
            } else if (this.digit(current)) {
                var i = index + 1;
                index -= code[index - 1].match(/^[\+-]$/) ? 1 : 0;
                while (this.number(code.slice(index, i).join(''))
                        || flags.STRING) {
                    i++;
                    if (code[i] === '.') {
                        i += 2;
                    }
                }
                tokens.push(code.slice(index, i - 1).join(''));
                index = i - 2;
            } else if (current.match(/^['"]$/)) {
                if (flags.STRING === current) {
                    flags.STRING = false;
                } else {
                    flags.STRING = current;
                }
                tokens.push(current);
            } else if (!this.whitespace(current)) {
                tokens.push(current);
            }
            index++;
        }

        this.tokens = [];
        for (var i = 0; i < tokens.length; i++) {
            var current = tokens[i];
            if (current === '#') {
                this._label(current, 'PREPROCESSOR_DIRECTIVE');
            } else if (this.datatype(current)) {
                var end = i;
                while (this.datatype(tokens.slice(i, ++end).join(' ')));
                this._label(tokens.slice(i, end - 1).join(' '), 'DATATYPE');
                i = end - 2;
            } else if (this.keyword(current)) {
                this._label(current, 'KEYWORD');
            } else if (tokens[i -1].match(/^['"']$/)
                    && tokens[i - 1] === tokens[i + 1]) {
                this._label(current, 'STRING');
            } else if (this.identifier(current)) {
                this._label(current, 'IDENTIFIER');
            } else if (this.number(current)) {
                this._label(current, 'NUMBER');
            } else if (this.operation(current)) {
                var next = tokens[i + 1];
                if (next === '=') {
                    this._label(current + next, 'OPERATION_ASSIGNMENT');
                    i++;
                } else if (current === '+' && next === '+') {
                    this._label(current + next, 'INCREMENT');
                    i++;
                } else if (current === '-' && next === '-') {
                    this._label(current + next, 'DECREMEMENT');
                    i++;
                } else {
                    this._label(current, 'OPERATION');
                }
            } else if (current.match(/^[|&]$/)) {
                var next = tokens[i + 1];
                if (current === next) {
                    this._label(current + next, 'LOGICAL_OPERATION');
                    i++;
                } else {
                    this._label(current, 'OPERATION');
                }
            } else if (current.match(/^(<|>|=|!)$/)) {
                var next = tokens[i + 1];
                if (next === '=') {
                    this._label(current + next, 'COMPARISON');
                    i++;
                } else if (current === '!') {
                    this._label(current, 'NOT_OPERATION');
                } else if (current === '<' || current === '>') {
                    var end = i;
                    while (!tokens[++end].match(/^[;)?]$/));
                    if (tokens[end] === ';' && current === '<') {
                        this._label(current, 'OPENING_ANGLE_BRACKET');
                    } else if (tokens[end] === ';' && current === '>') {
                        this._label(current, 'CLOSING_ANGLE_BRACKET');
                    } else {
                        this._label(current, 'COMPARISON');
                    }
                } else if (current === '=') {
                    this._label(current, 'ASSIGNMENT_OPERATION');
                }
            } else if (current === '.') {
                var end = i;
                while (!tokens[++end].match(/^[>|&)?]$/));
                if (tokens[end] === '>') {
                    var value = '';
                    var token = this.tokens.pop();
                    while (token.token !== '<') {
                        value += token.token;
                        token = this.tokens.pop();
                    }
                    this.tokens.push(token);
                    value += tokens.slice(i, end).join('');
                    i = end - 1;
                    this._label(value, 'HEADER_FILE');
                } else {
                    this._label(current, 'DOT_OPERATION');
                }
            } else if (current.match(/^[,;]$/)) {
                this._label(current, 'DELIMITER');
            } else if (current === '"') {
                this._label(current, 'DOUBLE_QUOTE');
            } else if (current === '\'') {
                this._label(current, 'SINGLE_QUOTE');
            } else if (current === '(') {
                this._label(current, 'OPENING_PARENTHESIS');
            } else if (current === ')') {
                this._label(current, 'CLOSING_PARENTHESIS');
            } else if (current === '[') {
                this._label(current, 'OPENING_BRACKET');
            } else if (current === ']') {
                this._label(current, 'CLOSING_BRACKET');
            } else if (current === '{') {
                this._label(current, 'OPENING_BRACES');
            } else if (current === '}') {
                this._label(current, 'CLOSING_BRACES');
            } else if (current === '?') {
                this._label(current, 'TERNARY_CONDITION');
            } else if (current === ':') {
                this._label(current, 'TERNARY_SELECTION');
            } else {
                this._label(current, 'UNCLASSIFIED');
            }
        }

        console.log(this.tokens);
    }

    TokenizedCode.prototype.letter = function(token) {
        return token && token.match(/^[A-Za-z_]$/);
    };

    TokenizedCode.prototype.digit = function(token) {
        return token && token.match(/^[0-9]$/);
    };

    TokenizedCode.prototype.number = function(token) {
        return token && token.match(/^([0-9]*|(-|\+)[0-9]+)(\.[0-9]+)?$/);
    };

    TokenizedCode.prototype.alphanumeric = function(token) {
        return token && token.match(/[A-Za-z0-9_]+/);
    };

    TokenizedCode.prototype.whitespace = function(token) {
        return token && token.match(/^[ \n\t]$/);
    };

    TokenizedCode.prototype.datatype = function(token) {
        var datatypes = ['char', 'signed char', 'unsigned char', 'short',
            'short int', 'signed short', 'signed short int', 'unsigned short',
            'unsigned short int', 'int', 'signed int', 'unsigned',
            'unsigned int', 'long', 'long int', 'signed long',
            'signed long int', 'unsigned long', 'unsigned long int',
            'long long', 'long long int', 'signed long long',
            'signed long long int', 'unsigned long long',
            'unsigned long long int', 'float', 'double', 'long double', 'void'];
        for (var i = 0; i < datatypes.length; i++) {
            if (datatypes[i].indexOf(token) === 0
                    && (datatypes[i].substring(token.length).charAt(0) === ' '
                    || !datatypes[i].substring(token.length).charAt(0))) {
                return true;
            }
        }
        return false;
    };

    TokenizedCode.prototype.keyword = function(token) {
        var keywords = ['break', 'case', 'const', 'continue', 'default', 'do',
            'else', 'entry', 'extern', 'for', 'goto', 'register', 'return',
            'sizeof', 'static', 'struct', 'switch', 'typedef', 'union',
            'while'];
        for (var i = 0; i < keywords.length; i++) {
            if (keywords[i] === token) {
                return true;
            }
        }
        return false;
    };

    TokenizedCode.prototype.identifier = function(token) {
        return !!token.match(/^[A-Za-z_][A-Za-z0-9_]*$/);
    };

    TokenizedCode.prototype.operation = function(token) {
        return !!token.match(/^[%/*\+-]$/);
    };

    TokenizedCode.prototype._label = function(token, label) {
        this.tokens.push({ token: token, label: label });
    };


    function tokenize(code) {
        var result = new TokenizedCode(code);
    }


    return tokenize;
});
