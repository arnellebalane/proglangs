var $editor = $('#editor');
var $tokens = $('#tokens');


$('[data-action="tokenize"]').on('click', function() {
    var code = $('#code').val();
    var tokens = tokenize_code_basic(code);

    $tokens.empty();
    for (var key in tokens) {
        var section = $('<section></section>');
        section.append('<h1>' + key + '</h1>');
        for (var i = 0; i < tokens[key].length; i++) {
            section.append('<p>' + tokens[key][i] + '</p>');
        }
        $tokens.append(section);
    }

    $editor.addClass('half');
    $tokens.addClass('shown');
});
