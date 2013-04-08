
describe('Object Literal Parse', {

    'Should be able to parse simple object literals': function() {
        var result = parseObjectLiteral("a: 1, b: 2, \"quotedKey\": 3, 'aposQuotedKey': 4");
        value_of(result).should_be([["a", "1"], ["b", "2"], ["quotedKey", "3"], ["aposQuotedKey", "4"]]);
    },

    'Should ignore any outer braces': function() {
        var result = parseObjectLiteral("{a: 1}");
        value_of(result).should_be([["a", "1"]]);
    },

    'Should be able to parse object literals containing string literals': function() {
        var result = parseObjectLiteral("a: \"comma, colon: brace{ bracket[ apos' escapedQuot\\\" end\", b: 'escapedApos\\' brace} bracket] quot\"'");
        value_of(result).should_be([
            ["a", "\"comma, colon: brace{ bracket[ apos' escapedQuot\\\" end\""],
            ["b", "'escapedApos\\' brace} bracket] quot\"'"]
        ]);
    },

    'Should be able to parse object literals containing child objects, arrays, function literals, and newlines': function() {
        // The parsing may or may not keep unnecessary spaces. So to avoid confusion, avoid unnecessary spaces.
        var result = parseObjectLiteral(
            "myObject:{someChild:{}, someChildArray:[1,2,3], \"quotedChildProp\":'string value'},\n"
          + "someFn:function(a,b,c){var regex=/{/g;var str='/})({';return{};},"
          + "myArray:[{}, function(){}, \"my'Str\", 'my\"Str']"
        );
        value_of(result).should_be([
            ["myObject", "{someChild:{},someChildArray:[1,2,3],\"quotedChildProp\":'string value'}"],
            ["someFn", "function(a,b,c){var regex=/{/g;var str='/})({';return{};}"],
            ["myArray", "[{},function(){},\"my'Str\",'my\"Str']"]
        ]);
    },

    'Should be able to parse object literals containing division and not confuse it with regular expressions': function() {
        var result = parseObjectLiteral("c: null / 0, a: 2 / 1, b: (3) / 2");
        value_of(result).should_be([["c", "null/0"], ["a", "2/1"], ["b", "(3)/2"]]);
    },

    'Should be able to parse object literals containing division and regular expressions': function() {
        var result = parseObjectLiteral("div: null/0, regexpFunc: function(){var regex=/{/g;return /123/;}");
        value_of(result).should_be([["div", "null/0"], ["regexpFunc", "function(){var regex=/{/g;return/123/;}"]]);
    },
    'Should be able to parse unquoted keys with some special characters': function() {
        var result = parseObjectLiteral("a.b: 1, b+c: 2, c=d: 3, d_e: 4");
        value_of(result).should_be([["a.b", "1"], ["b+c", "2"], ["c=d", "3"], ["d_e", "4"]]);
    },

    'Should be able to cope with malformed syntax (things that aren\'t key-value pairs)': function() {
        var result = parseObjectLiteral("malformed1, 'mal:formed2', good:3, { malformed: 4 }, good5:5");
        // "{ malformed: 4 }" get's skipped because there's no valid key value
        value_of(result).should_be([["malformed1", undefined], ["mal:formed2", undefined], ["good", "3"], ["good5", "5"]]);
    }
});
