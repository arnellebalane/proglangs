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
        this.code = code.split('');
        this.tokens = [];
        this.index = 0;
        var buffer = '';
        var flags = {
            STRING: false
        };

        while (this.index < code.length) {
            var current = this.code[this.index];
            var next = this.code[this.index + 1];
            if (current === '#') {
                if (flags.STRING && !buffer.length) {
                    buffer += current;
                } else {
                    this.tokens.push({
                        label: 'PREPROCESSOR_DIRECTIVE',
                        value: current
                    });
                }
            } else if (this.letter(current)) {
                if (flags.STRING) {
                    buffer += current;
                } else {
                    var result = this._datatype(this.index);
                    if (result.matched) {
                        this.tokens.push({
                            label: 'DATATYPE',
                            value: result.token
                        });
                        this.index = result.end;
                        continue;
                    }
                    result = this._identifier(this.index);
                    if (result.matched) {
                        this.tokens.push({
                            label: 'IDENTIFIER',
                            value: result.token
                        });
                        this.index = result.end;
                    }
                }
            } else if (this.digit(current)) {
                if (flags.STRING) {
                    buffer += current;
                } else {
                    var result = this._number(this.index);
                    if (result.matched) {
                        this.tokens.push({
                            label: 'NUMBER',
                            value: result.token
                        });
                        this.index = result.end;
                    }
                }
            } else if (this.operation(current)) {
                if (flags.STRING) {
                    buffer += current;
                } else {
                    if (current === '+' && next === '+'
                            || current === '-' && next === '-') {
                        this.tokens.push({
                            label: current === '+' ? 'INCREMENT' : 'DECREMENT',
                            value: current + next
                        });
                        this.index++;
                    } else if (next === '=') {
                        this.tokens.push({
                            label: 'OPERATION_ASSIGNMENT',
                            value: current + next
                        });
                        this.index++;
                    } else {
                        this.tokens.push({
                            label: 'OPERATION',
                            value: current
                        });
                    }
                }
            } else if (current === '"') {
                if (flags.STRING) {
                    this.tokens.push({
                        label: 'STRING',
                        value: buffer
                    });
                    buffer = '';
                    this.tokens.push({
                        label: 'DOUBLE_QUOTE',
                        value: '"'
                    });
                    flags.STRING = false;
                } else {
                    this.tokens.push({
                        label: 'DOUBLE_QUOTE',
                        value: current
                    });
                    flags.STRING = true;
                }
            } else if (this.whitespace(current)) {
                if (flags.STRING) {
                    buffer += current;
                }
            }
            this.index++;
        }
    }

    TokenizedCode.prototype.letter = function(token) {
        return token.match(/^[A-Za-z_]$/);
    };

    TokenizedCode.prototype.digit = function(token) {
        return token.match(/^[0-9]$/);
    };

    TokenizedCode.prototype.number = function(token) {
        return token.match(/^[0-9]*(\.[0-9]+)?$/);
    };

    TokenizedCode.prototype.alphanumeric = function(token) {
        return token.match(/^[A-Za-z0-9_]$/);
    };

    TokenizedCode.prototype.whitespace = function(token) {
        return token.match(/^[ \n\t]$/);
    };

    TokenizedCode.prototype.identifer = function(token) {
        return token.match(/^[A-Za-z_][A-Za-z0-9_]*$/);
    };

    TokenizedCode.prototype.operation = function(token) {
        return token.match(/^[%/*\+-]$/);
    };

    TokenizedCode.prototype._datatype = function(start) {
        var end = start + 1;
        var pattern = /^(void|int|double|float|char)$/;
        while (this.alphanumeric(this.code[end])) {
            end++;
        }
        var token = this.code.slice(start, end).join('');
        if (token.match(pattern)) {
            return { matched: true, token: token, end: end };
        }
        return { matched: false };
    };

    TokenizedCode.prototype._identifier = function(start) {
        var end = start + 1;
        while (this.alphanumeric(this.code[end])) {
            end++;
        }
        var token = this.code.slice(start, end).join('');
        return { matched: true, token: token, end: end };
    };

    TokenizedCode.prototype._number = function(start) {
        var end = start + 1;
        while (this.number(this.code.slice(start, end).join(''))) {
            end++;
            if (this.code[end] === '.') {
                end += 2;
            }
        }
        var token = this.code.slice(start, end - 1).join('');
        return { matched: true, token: token, end: end - 1 };
    };


    function tokenize(code) {
        var result = new TokenizedCode(code);
        console.log(result.tokens);
        return result.tokens;
    }


    return tokenize;
});
