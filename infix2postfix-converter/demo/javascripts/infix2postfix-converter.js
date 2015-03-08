(function(root, definition) {
    if (typeof define === 'function' && define.amd) {
        define(['equation-tokenizer/equation-tokenizer'], definition);
    } else if (typeof exports === 'object') {
        var tokenize = require('../equation-tokenizer/equation-tokenizer');
        module.exports = definition(tokenize);
    } else {
        root.infix2postfix = definition(root.tokenize_equation);
    }
})(this, function(tokenize) {
    var precedences = { '^': 3, '*': 2, '/': 2, '%': 2, '+': 1, '-': 1 };


    function precedence(a, b) {
        if (precedences[a] > precedences[b]) {
            return -1;
        } else if (precedences[b] > precedences[a]) {
            return 1;
        }
        return 0;
    }


    function convert(equation, keep_tokens) {
        var tokens = equation instanceof Array ? equation : tokenize(equation, true);
        var stack = [];
        var postfix = [];

        tokens.forEach(function(token) {
            if (token.type === 'operand') {
                postfix.push(token);
            } else if (token.type === 'operator') {
                if (!stack.length) {
                    stack.push(token);
                } else {
                    var top = stack.pop();
                    var _token = token;
                    while (top && top.value !== '(') {
                        if (precedence(token.value, top.value) < 0) {
                            stack.push(top, token);
                            _token = null;
                            break;
                        }
                        postfix.push(top);
                        top = stack.pop();
                    }
                    if (top && top.value === '(') {
                        stack.push(top);
                    }
                    if (_token) {
                        stack.push(_token);
                    }
                }
            } else if (token.type === 'group') {
                if (token.value === '(') {
                    stack.push(token);
                } else if (token.value === ')') {
                    var top = stack.pop();
                    while (top && top.value !== '(') {
                        postfix.push(top);
                        top = stack.pop();
                    }
                }
            }
        });

        while (stack.length) {
            postfix.push(stack.pop());
        }

        if (!keep_tokens) {
            var values = [];
            postfix.forEach(function(token) {
                values.push(token.value);
            });
            return values.join(' ');
        }
        return postfix;
    }


    return convert;
});
