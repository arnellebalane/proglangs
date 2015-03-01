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