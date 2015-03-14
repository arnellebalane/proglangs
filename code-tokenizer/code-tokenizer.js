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
                var i = index + 1;
                while (this.alphanumeric(code[i]) || flags.STRING) {
                    i++;
                    if (flags.STRING && code[i] === '"') {
                        flags.STRING = false;
                    }
                }
                tokens.push(code.slice(index, i).join(''));
                index = i - 1;
            } else if (this.digit(current)) {
                var i = index + 1;
                while (this.number(code.slice(index, i).join(''))
                        || flags.STRING) {
                    i++;
                    if (code[i] === '.') {
                        i += 2;
                    }
                }
                tokens.push(code.slice(index, i).join(''));
                index = i - 1;
            } else if (current === '"') {
                flags.STRING = true;
                tokens.push(current);
            } else if (!this.whitespace(current)) {
                tokens.push(current);
            }
            index++;
        }

        console.log(tokens);
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
        return token.match(/[A-Za-z0-9_]+/);
    };

    TokenizedCode.prototype.whitespace = function(token) {
        return token.match(/^[ \n\t]$/);
    };


    function tokenize(code) {
        var result = new TokenizedCode(code);
    }


    return tokenize;
});
