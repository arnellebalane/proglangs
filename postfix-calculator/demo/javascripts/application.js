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

    if (value.length) {
        try {
            var result = calculate_postfix(value);
            output.text(result);
        } catch (e) {
            output.text(e.message);
        }
    }
});


setTimeout(function() {
    input.val('ENTER');
    container.width(5 * 20 + 38);
}, 500);

setTimeout(function() {
    input.val('POSTFIX');
    container.width(7 * 20 + 38);
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
