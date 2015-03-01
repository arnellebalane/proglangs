(function(root, definition) {
    if (typeof define === 'function' && define.amd) {
        define([], definition);
    } else if (typeof exports === 'object') {
        module.exports = definition();
    } else {
        root.tokenize_equation = definition();
    }
})(this, function() {
    function tokenize(equation, label) {
        var tokens = [];
        var buffer = '';
        var type = 'equation';
        var parentheses = 0;

        function append(token) {
            if (typeof token === 'string' 
                    &&!token.match(/^[A-Za-z_][A-Za-z0-9_]*|[0-9]*\.?[0-9]+|[*+\/%-]$/)) {
                throw new Error('Invalid Token: ' + token);
            }
            token = typeof token === 'string' 
                && token.match(/^[0-9]*\.?[0-9]+$/) ? +token : token;
            if (!label || token instanceof Array) {
                tokens = tokens.concat(token);
            } else {
                tokens.push({ value: token, type: type });
            }
        }

        equation.split('').forEach(function(character) {
            if (character.trim().length) {
                var _type = 'equation';
                if (character.match(/[A-Za-z0-9_]/)) {
                    _type = 'operand';
                } else if (character.match(/[+*\/%-]/)) {
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
