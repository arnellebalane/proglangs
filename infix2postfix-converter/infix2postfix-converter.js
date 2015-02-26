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
    function precedence(a, b) {
        if ((a === '*' || a === '/') && (b === '+' || b === '-')) {
            return -1;
        } else if ((a === '+' || a === '-') && (b === '*' || b === '/')) {
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
                    if (precedence(token.value, top.value) <= 0) {
                        stack.push(top, token);
                    } else {
                        stack.push(token);
                        postfix.push(top);
                    }
                }
            } else if (token.type === 'equation') {
                postfix = postfix.concat(convert(token.value, true));
            }
        });

        while (stack.length) {
            postfix.push(stack.pop());
        }

        if (!keep_tokens) {
            var values = [];
            postfix.forEach(function(token) {
                values.push(token.value)
            });
            return values.join(' ');
        }
        return postfix;
    }


    return convert;
});