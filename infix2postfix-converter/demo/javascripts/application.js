var container = $('#input');
var input = container.find('input');
var output = $('#output');


input.on('keydown keyup change', function(e) {
    var value = $(this).val().trim();
    container.width(value.length * 20 + 38);
    if (value.length) {
        container.addClass('non-empty');
        output.addClass('shown');
    } else {
        container.removeClass('non-empty');
        output.removeClass('shown');
    }

    try {
        var postfix = infix2postfix(value);
        output.text(postfix);
    } catch (e) {
        output.text(e.message);
    }
});


setTimeout(function() {
    input.val('ENTER');
    container.width(5 * 20 + 38);
}, 500);

setTimeout(function() {
    input.val('INFIX');
    container.width(5 * 20 + 38);
}, 1000);

setTimeout(function() {
    input.val('EQUATION');
    container.width(8 * 20 + 38);
}, 1500);

setTimeout(function() {
    input.val('NOW');
    container.width(3 * 20 + 38);
}, 2000);

setTimeout(function() {
    input.val('');
    container.width(0 * 20 + 38);
}, 2500);
