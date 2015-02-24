(function(root, definition) {
    if (typeof define === 'function' && define.amd) {
        define([], definition);
    } else if (typeof exports === 'object') {
        module.exports = definition;
    } else {
        root.tokenize = definition();
    }
})(this, function() {
    function Token(value, type) {
        this.value = value;
        this.type = type;
    }


    function tokenize(equation) {
        var tokens = [];
        var parentheses = [];
        var buffer = '';
        var type = 'equation';

        equation.split('').forEach(function(character) {
            if (character.trim().length) {
                var _type = 'equation';
                if (character.match(/\d/)) {
                    _type = 'operator';
                } else if (character.match(/[+*\/-]/)) {
                    _type = 'operation';
                }

                if (type !== _type) {
                    if (buffer.length) {
                        tokens.push(new Token(buffer, type));
                        buffer = '';
                    }
                    type = _type;
                }

                buffer += character;
            }
        });
        tokens.push(new Token(buffer, type));

        return tokens;
    }


    return tokenize;
});