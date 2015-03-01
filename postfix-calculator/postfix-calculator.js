(function(root, definition) {
    if (typeof define === 'function' && define.amd) {
        define(['equation-tokenizer/equation-tokenizer'], definition);
    } else if (typeof exports === 'object') {
        var tokenize = require('../equation-tokenizer/equation-tokenizer');
        module.exports = definition(tokenize);
    } else {
        root.calculate_postfix = definition(root.tokenize_equation);
    }
})(this, function(tokenize) {
    function evaluate(a, operator, b) {
        if (operator === '+') {
            return a + b;
        } else if (operator === '-') {
            return a - b;
        } else if (operator === '*') {
            return a * b;
        } else if (operator === '/') {
            return a / b;
        } else if (operator === '%') {
            return a % b;
        }
        throw new Error('Invalid Operation.');
    }


    function calculate(postfix) {
        var tokens = postfix instanceof Array ? postfix : tokenize(postfix, true);
        var stack = [];

        tokens.forEach(function(token) {
            if (token.type === 'operand') {
                stack.push(token);
            } else if (token.type === 'operator') {
                var b = stack.pop();
                var a = stack.pop();
                if (!a || !b || a.type !== 'operand' || b.type !== 'operand') {
                    throw new Error('Invalid Postfix Statement.');
                }
                var result = evaluate(a.value, token.value, b.value);
                stack.push({ value: result, type: 'operand' });
            }
        });

        if (stack.length > 1) {
            throw new Error('Invalid Postfix Statement.');
        }
        return stack.pop().value;
    }


    return calculate;
});