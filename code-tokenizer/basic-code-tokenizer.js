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
        for (var i = 0; i < tokens.length; i++) {
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
        for (var i = 0; i < tokens.length; i++) {
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


    function keywords(tokens) {
        var results = [];
        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i].label.match(/^(KEYWORD|DATATYPE)$/)
                    && results.indexOf(tokens[i].token) === -1) {
                results.push(tokens[i].token);
            }
        }
        return results;
    }


    function operators(tokens) {
        var results = [];
        var labels = ['OPERATION', 'COMPARISON', 'INCREMENT', 'DECREMENT',
            'LOGICAL_OPERATION', 'OPERATION_ASSIGNMENT', 'ASSIGNMENT',
            'NOT_OPERATION', 'DOT_OPERATION', 'TERNARY_OPERATION',
            'TERNARY_SELECTION'];
        for (var i = 0; i < tokens.length; i++) {
            if (labels.indexOf(tokens[i].label) > -1
                    && results.indexOf(tokens[i].token) === -1) {
                results.push(tokens[i].token);
            }
        }
        return results;
    }


    function punctuators(tokens) {
        var results = [];
        var labels = ['OPENING_PARENTHESIS', 'CLOSING_PARENTHESIS',
            'OPENING_ANGLE_BRACKET', 'CLOSING_ANGLE_BRACKET',
            'OPENING_BRACKET', 'CLOSING_BRACKET', 'OPENING_BRACES',
            'CLOSING_BRACES', 'DELIMITER', 'SINGLE_QUOTE', 'DOUBLE_QUOTE'];
        for (var i = 0; i < tokens.length; i++) {
            if (labels.indexOf(tokens[i].label) > -1
                    && results.indexOf(tokens[i].token) === -1) {
                results.push(tokens[i].token);
            }
        }
        return results;
    }


    function parameters(tokens) {
        var results = [];
        var calls = function_calls(tokens);
        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i].label === 'OPENING_PARENTHESIS'
                    && (tokens[i - 1].label === 'IDENTIFIER'
                    || tokens[i - 2].label === 'IDENTIFIER')) {
                var function_name = tokens[i - 1].label === 'IDENTIFIER'
                    ? tokens[i - 1].token : tokens[i - 2].token;
                if (calls.indexOf(function_name) > -1) {
                    var count = 1;
                    var start = i + 1;
                    for (var j = i + 1; count; j++) {
                        if (tokens[j].label === 'OPENING_PARENTHESIS') {
                            count++;
                        } else if (tokens[j].label === 'CLOSING_PARENTHESIS') {
                            count--;
                            if (!count) {
                                var value = '';
                                while (start < j) {
                                    value += tokens[start++].token;
                                }
                                if (value.length) {
                                    results.push(value);
                                }
                            }
                        } else if (tokens[j].label === 'DELIMITER') {
                            if (count === 1) {
                                var value = '';
                                while (start < j) {
                                    value += tokens[start++].token;
                                }
                                if (value.length) {
                                    results.push(value);
                                }
                                start++;
                            }
                        }
                    }
                }
            }
        }
        return results;
    }


    function variables(tokens) {
        var results = [];
        var defined = functions(tokens);
        var calls = function_calls(tokens);
        var reserved = keywords(tokens);
        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i].label === 'IDENTIFIER'
                    && defined.indexOf(tokens[i].token) === -1
                    && calls.indexOf(tokens[i].token) === -1
                    && reserved.indexOf(tokens[i].token) === -1
                    && tokens[i - 1].label.match(/^(WHITESPACE|DELIMITER)$/)
                    && results.indexOf(tokens[i].token) === -1) {
                results.push(tokens[i].token);
            }
        }
        return results;
    }


    function tokenize(code) {
        var tokens = _tokenize(code);
        return {
            macros: macros(tokens),
            functions: functions(tokens),
            function_calls: function_calls(tokens),
            keywords: keywords(tokens),
            operators: operators(tokens),
            punctuators: punctuators(tokens),
            parameters: parameters(tokens),
            variables: variables(tokens)
        };
    }


    return tokenize;
});
