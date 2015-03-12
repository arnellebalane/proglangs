(function(root, definition) {
    if (typeof define === 'function' && define.amd) {
        define([], definition);
    } else if (typeof exports === 'object') {
        module.exports = definition();
    } else {
        root.tokenize_code = definition();
    }
})(this, function() {
    function tokenize(code) {

    }


    return tokenize;
});
