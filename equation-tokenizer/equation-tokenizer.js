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

        equation.split('').forEach(function(character) {
            if (character.trim().length) {
                var _type = 'equation';
                if (character.match(/\d/)) {
                    _type = 'operand';
                } else if (character.match(/[+*\/%-]/)) {
                    _type = 'operator';
                }

                if ((_type !== type || _type === 'operator') && !parentheses) {
                    if (buffer) {
                        buffer = buffer.match(/\d+/) ? +buffer : buffer;
                        tokens.push(label ? { value: buffer, type: type } : buffer);
                        buffer = '';
                    }
                    type = _type;
                }

                buffer += character;
            } else if (buffer && !parentheses) {
                buffer = buffer.match(/\d+/) ? + buffer : buffer;
                tokens.push(label ? { value: buffer, type: type } : buffer);
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
                    tokens.push(label ? { value: value, type: type } : value);
                    buffer = '';
                }
            }
        });

        if (parentheses) {
            throw new Error('Parenthesis Mismatched.');
        } else if (buffer) {
            buffer = buffer.match(/\d+/g) ? +buffer : buffer;
            tokens.push(label ? { value: buffer, type: type } : buffer);
        }

        return tokens;
    }


    return tokenize;
});
