(function(root, definition) {
    if (typeof define === 'function' && define.amd) {
        define([], definition);
    } else if (typeof exports === 'object') {
        module.exports = definition();
    } else {
        root.tokenize_equation = definition();
    }
})(this, function() {
    function is_identifier(token) {
        return token.match(/^[A-Za-z_][A-Za-z0-9_]*$/);
    }

    function is_alphanumeric(token) {
        return token.match(/^[A-Za-z0-9_\.]$/);
    }

    function is_numeric(token) {
        return token.match(/^[0-9]*\.?[0-9]+$/);
    }

    function is_operator(token) {
        return token.match(/^[+\-*\/%\^]$/);
    }


    function tokenize(equation, label) {
        var tokens = [];
        var buffer = '';
        var type = 'equation';
        var parentheses = 0;

        function append(token) {
            if (typeof token === 'string' && !is_identifier(token)
                    && !is_numeric(token) && !is_operator(token)) {
                throw new Error('Invalid Token: ' + token);
            }
            token = typeof token === 'string'
                && is_numeric(token) ? +token : token;
            if (!label || token instanceof Array) {
                tokens = tokens.concat(token);
            } else {
                tokens.push({ value: token, type: type });
            }
        }

        equation.split('').forEach(function(character) {
            if (character.trim().length) {
                var _type = 'equation';
                if (is_alphanumeric(character)) {
                    _type = 'operand';
                } else if (is_operator(character)) {
                    _type = 'operator';
                }

                if ((_type !== type || _type === 'operator') && !parentheses) {
                    if (buffer) {
                        append(buffer);
                        buffer = '';
                    }
                    type = _type;
                }

                buffer += character;
            } else if (buffer && !parentheses) {
                append(buffer);
                buffer = '';
            }

            if (character === '(') {
                parentheses++;
            } else if (character === ')') {
                if (!parentheses) {
                    throw new Error('Parenthesis Mismatched.');
                } else if (!--parentheses) {
                    buffer = buffer.substring(1, buffer.length - 1);
                    var value = tokenize(buffer, label);
                    value.unshift(label ? { value: '(', type: 'group' } : '(');
                    value.push(label ? { value: ')', type: 'group' } : ')');
                    append(value);
                    buffer = '';
                }
            }
        });

        if (parentheses) {
            throw new Error('Parenthesis Mismatched.');
        } else if (buffer) {
            append(buffer);
            buffer = '';
        }

        return tokens;
    }


    return tokenize;
});
