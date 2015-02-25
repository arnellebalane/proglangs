(function(root, definition) {
    if (typeof define === 'function' && define.amd) {
        define([], definition);
    } else if (typeof exports === 'object') {
        module.exports = definition();
    } else {
        root.tokenize = definition();
    }
})(this, function() {
    function tokenize(equation, label) {
        var tokens = [];
        var buffer = '';
        var type = 'equation';

        equation.split('').forEach(function(character) {
            if (character.trim().length) {
                var _type = 'equation';
                if (character.match(/\d/)) {
                    _type = 'operand';
                } else if (character.match(/[+*\/-]/)) {
                    _type = 'operator';
                }

                if (type !== _type) {
                    if (buffer.length) {
                        buffer = buffer.match(/\d+/g) ? +buffer : buffer;
                        tokens.push(label ? { value: buffer, type: type } : buffer);
                        buffer = '';
                    }
                    type = _type;
                }

                buffer += character;
            }
        });
        buffer = buffer.match(/\d+/g) ? +buffer : buffer;
        tokens.push(label ? { value: buffer, type: type } : buffer);

        return tokens;
    }


    return tokenize;
});