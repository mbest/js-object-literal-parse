
describe('Object Literal Parse', {

    'Should be able to parse simple object literals': function() {
        var result = parseObjectLiteral("a: 1, b: 2, \"quotedKey\": 3, 'aposQuotedKey': 4");
        value_of(result.length).should_be(4);
        value_of(result[0][0]).should_be("a");
        value_of(result[0][1]).should_be("1");
        value_of(result[1][0]).should_be("b");
        value_of(result[1][1]).should_be("2");
        value_of(result[2][0]).should_be("quotedKey");
        value_of(result[2][1]).should_be("3");
        value_of(result[3][0]).should_be("aposQuotedKey");
        value_of(result[3][1]).should_be("4");
    },

    'Should ignore any outer braces': function() {
        var result = parseObjectLiteral("{a: 1}");
        value_of(result.length).should_be(1);
        value_of(result[0][0]).should_be("a");
        value_of(result[0][1]).should_be("1");
    },

    'Should be able to parse object literals containing string literals': function() {
        var result = parseObjectLiteral("a: \"comma, colon: brace{ bracket[ apos' escapedQuot\\\" end\", b: 'escapedApos\\\' brace} bracket] quot\"'");
        value_of(result.length).should_be(2);
        value_of(result[0][0]).should_be("a");
        value_of(result[0][1]).should_be("\"comma, colon: brace{ bracket[ apos' escapedQuot\\\" end\"");
        value_of(result[1][0]).should_be("b");
        value_of(result[1][1]).should_be("'escapedApos\\\' brace} bracket] quot\"'");
    },

    'Should be able to parse object literals containing child objects, arrays, function literals, and newlines': function() {
        // The parsing may or may not keep unnecessary spaces. So to avoid confusion, avoid unnecessary spaces.
        var result = parseObjectLiteral(
            "myObject:{someChild:{},someChildArray:[1,2,3],\"quotedChildProp\":'string value'},\n"
          + "someFn:function(a,b,c){var regex=/}/g;var str='/})({';return{};},"
          + "myArray:[{},function(){},\"my'Str\",'my\"Str']"
        );
        value_of(result.length).should_be(3);
        value_of(result[0][0]).should_be("myObject");
        value_of(result[0][1]).should_be("{someChild:{},someChildArray:[1,2,3],\"quotedChildProp\":'string value'}");
        value_of(result[1][0]).should_be("someFn");
        value_of(result[1][1]).should_be("function(a,b,c){var regex=/}/g;var str='/})({';return{};}");
        value_of(result[2][0]).should_be("myArray");
        value_of(result[2][1]).should_be("[{},function(){},\"my'Str\",'my\"Str']");
    },

    'Should be able to cope with malformed syntax (things that aren\'t key-value pairs)': function() {
        var result = parseObjectLiteral("malformed1, 'mal:formed2', good:3, { malformed: 4 }, good5:5");
        value_of(result.length).should_be(4);
        value_of(result[0][0]).should_be("malformed1");
        value_of(result[0][1]).should_be(undefined);
        value_of(result[1][0]).should_be("mal:formed2");
        value_of(result[1][1]).should_be(undefined);
        value_of(result[2][0]).should_be("good");
        value_of(result[2][1]).should_be("3");
        // "{ malformed: 4 }" get's skipped because there's no valid key value
        value_of(result[3][0]).should_be("good5");
        value_of(result[3][1]).should_be("5");
    }
});
