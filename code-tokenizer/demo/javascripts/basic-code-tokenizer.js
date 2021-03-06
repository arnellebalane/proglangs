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
    function _macros(tokens) {
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


    function _functions(tokens) {
        var results = [];
        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i].label === 'IDENTIFIER'
                    && tokens[i - 1].label === 'WHITESPACE'
                    && tokens[i - 2].label === 'DATATYPE'
                    && (tokens[i + 1].label === 'OPENING_PARENTHESIS'
                    || tokens[i + 2].label === 'OPENING_PARENTHESIS')
                    && results.indexOf(tokens[i].token) === -1) {
                results.push(tokens[i].token);
            }
        }
        return results;
    }


    function _function_calls(tokens) {
        var results = [];
        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i].label === 'IDENTIFIER'
                    && tokens[i - 2]
                    && tokens[i - 2].label !== 'DATATYPE'
                    && (tokens[i + 1].label === 'OPENING_PARENTHESIS'
                    || tokens[i + 2].label === 'OPENING_PARENTHESIS')
                    && results.indexOf(tokens[i].token) === -1) {
                results.push(tokens[i].token);
            }
        }
        return results;
    }


    function _keywords(tokens) {
        var results = [];
        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i].label.match(/^(KEYWORD|DATATYPE)$/)
                    && results.indexOf(tokens[i].token) === -1) {
                results.push(tokens[i].token);
            }
        }
        return results;
    }


    function _operators(tokens) {
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


    function _punctuators(tokens) {
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


    function _parameters(tokens) {
        var results = [];
        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i].label === 'OPENING_PARENTHESIS'
                    && (tokens[i - 1].label === 'IDENTIFIER'
                    || tokens[i - 2].label === 'IDENTIFIER')) {
                var x = tokens[i - 1].label === 'WHITESPACE' ? i - 2 : i - 1;
                if (tokens[x - 2].label === 'DATATYPE') {
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


    function _arguments(tokens) {
        var results = [];
        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i].label === 'OPENING_PARENTHESIS'
                    && (tokens[i - 1].label === 'IDENTIFIER'
                    || tokens[i - 2].label === 'IDENTIFIER')) {
                var x = tokens[i - 1].label === 'WHITESPACE' ? i - 2 : i - 1;
                if (tokens[x - 2].label !== 'DATATYPE') {
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
    };


    function _variables(tokens) {
        var results = [];
        var defined = _functions(tokens);
        var calls = _function_calls(tokens);
        var reserved = _keywords(tokens);
        var comments = _comments(tokens, true);
        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i].label === 'IDENTIFIER'
                    && comments.indexOf(i) === -1
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


    function _assignments(tokens) {
        var results = [];
        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i].label === 'ASSIGNMENT_OPERATION') {
                var start = i;
                var end = i;
                var value = '';
                while (tokens[--start].label !== 'IDENTIFIER');
                while (tokens[++end].label !== 'DELIMITER');
                while (start < end) {
                    value += tokens[start++].token;
                }
                results.push(value);
            }
        }
        return results;
    }


    function _comments(tokens, index) {
        var results = [];
        var indeces = [];
        for (var i = 0, q = 1; i < tokens.length; i++) {
            if (tokens[i].label === 'DOUBLE_QUOTE'
                    && tokens[i - 1].token !== '\\') {
                q *= -1;
            } else if (tokens[i].token === '/'
                    && tokens[i + 1].token === '/'
                    && q === 1) {
                var start = i;
                var end = i;
                var value = '';
                while (tokens[++end].token !== '\n');
                while (start < end) {
                    indeces.push(start);
                    value += tokens[start++].token;
                }
                results.push(value);
                i = end - 1;
            } else if (tokens[i].token === '/'
                    && tokens[i + 1].token === '*'
                    && q === 1) {
                var start = i;
                var end = i + 1;
                var value = '';
                while (!(tokens[end].token === '/'
                        && tokens[end - 1].token === '*')
                        && q === 1) {
                    end++;
                }
                while (start <= end) {
                    indeces.push(start);
                    value += tokens[start++].token;
                }
                results.push(value);
                i = end;
            }
        }
        return index ? indeces : results;
    };


    function tokenize(code) {
        var tokens = _tokenize(code);
        return {
            macros: _macros(tokens),
            functions: _functions(tokens),
            function_calls: _function_calls(tokens),
            keywords: _keywords(tokens),
            operators: _operators(tokens),
            punctuators: _punctuators(tokens),
            parameters: _parameters(tokens),
            arguments: _arguments(tokens),
            variables: _variables(tokens),
            assignments: _assignments(tokens),
            comments: _comments(tokens)
        };
    }


    return tokenize;
});
