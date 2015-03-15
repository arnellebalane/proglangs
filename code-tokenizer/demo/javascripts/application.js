var $editor = $('#editor');
var $tokens = $('#tokens');


$('[data-action="tokenize"]').on('click', function() {
    var code = $('#code').val();
    var tokens = tokenize_code_basic(code);

    console.log(tokens);

    $tokens.empty().scrollTop(0);
    for (var key in tokens) {
        var section = $('<section></section>');
        section.append('<h1>' + key.replace('_', ' ') + '</h1>');
        for (var i = 0; i < tokens[key].length; i++) {
            var token = $('<p></p>');
            token.text(tokens[key][i]);
            section.append(token);
        }
        $tokens.append(section);
    }

    $editor.addClass('half');
    $tokens.addClass('shown');
});
