(function(root, definition) {
    if (typeof define === 'function' && define.amd) {
        define(['code-tokenizer'], definition);
    } else if (typeof exports === 'object') {
        var tokenize = require('./code-tokenizer');
        module.exports = definition(tokenize);
    } else {
        root.tokenize_code_basic = definition(root.tokenize_code);
    }
})(this, function(_tokenize) {
    function macros(tokens) {
        var results = [];
        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i].label === 'PREPROCESSOR_DIRECTIVE') {
                var value = tokens[i].token;;
                var end = i + 1;
                var token = tokens[end];
                while (token && !(token.label === 'WHITESPACE'
                        && token.token === '\n')) {
                    value += token.token;
                    token = tokens[++end];
                }
                results.push(value);
                i = end;
            }
        }
        return results;
    }


    function functions(tokens) {
        var results = [];
        for (var i = 2; i < tokens.length; i++) {
            if (tokens[i].label === 'IDENTIFIER'
                    && (tokens[i + 1].label === 'OPENING_PARENTHESIS'
                    || tokens[i + 2].label === 'OPENING_PARENTHESIS')) {
                var end = i;
                while (!tokens[++end].token.match(/^[;{]$/));
                if (tokens[end].token === '{'
                        && results.indexOf(tokens[i].token) === -1) {
                    results.push(tokens[i].token);
                }
            }
        }
        return results;
    }


    function function_calls(tokens) {
        var results = [];
        for (var i = 2; i < tokens.length; i++) {
            if (tokens[i].label === 'IDENTIFIER'
                    && (tokens[i + 1].label === 'OPENING_PARENTHESIS'
                    || tokens[i + 2].label === 'OPENING_PARENTHESIS')) {
                var end = i;
                while (!tokens[++end].token.match(/^[;{]$/));
                if (tokens[end].token === ';'
                        && results.indexOf(tokens[i].token) === -1) {
                    results.push(tokens[i].token);
                }
            }
        }
        return results;
    }


    function tokenize(code) {
        var tokens = _tokenize(code);
        return {
            macros: macros(tokens),
            functions: functions(tokens),
            function_calls: function_calls(tokens)
        };
    }


    return tokenize;
});
