## Javascript Object Literal Parser

##### _Splits an object literal string into a set of top-level key-value pairs._
By [Michael Best](https://github.com/mbest)

**License:** MIT (http://www.opensource.org/licenses/mit-license.php)

Exports a single function, `parseObjectLiteral(str)` that accepts an object literal string (with or without enclosing braces) and returns an array of key-value string pairs. The key are strings, but unquoted keys are accepted as long as they don't contain these special characters: `,:()[]{}'"/`. The value is any valid Javascript expression; the parser will return it as a string (without evaluating it).

Notes: This parser is more lenient than a standard JavaScript parser, accepting unquoted keys with special characters and accepting keys without a value. It also silently ignores errors such as a missing key (the value will be skipped). If a value expression contains unquoted spaces, they may be stripped in the result.

Acknowledgments: This parser's functionality is based on the parser included in [Knockout](http://knockoutjs.com/) by Steven Sanderson. The examples below are also based on the specs in Knockout. This parser's implementation is inspired by [json-sans-eval](http://code.google.com/p/json-sans-eval/) by Mike Samuel. Compared the the Knockout parser, this one is smaller and about [three times as fast](http://jsperf.com/knockout-parse-object-literal).

### Examples

* Simple object literals

    ```
    parseObjectLiteral("a: 1, b: 2, \"quotedKey\": 3, 'aposQuotedKey': 4");
    ```

    ```
    [ ["a","1"], ["b","2"], ["quotedKey","3"], ["aposQuotedKey","4"] ]
    ```

* With enclosing braces

    ```
    parseObjectLiteral("{a: 1}");
    ```

    ```
    [ ["a","1"] ]
    ```

* String values

    ```
    parseObjectLiteral(
          "a: \"comma, colon: brace{ bracket[ apos' escapedQuot\\\" end\","
        + "b: 'escapedApos\\' brace} bracket] quot\"'");
    ```

    ```
    [
        ["a","\"comma, colon: brace{ bracket[ apos' escapedQuot\\\" end\""],
        ["b","'escapedApos\\' brace} bracket] quot\"'"]
    ]
    ```

* Values with objects, arrays, function literals, and regular expressions

    ```
    parseObjectLiteral(
          "myObject:{someChild:{}, someChildArray:[1,2,3], \"quotedChildProp\":'string value'},\n"
        + "someFn:function(a,b,c){var regex=/}/g;var str='/})({';return{};},"
        + "myArray:[{}, function(){}, \"my'Str\", 'my\"Str']"
        );
    ```

    ```
    [
        ["myObject","{someChild:{},someChildArray:[1,2,3],\"quotedChildProp\":'string value'}"],
        ["someFn","function(a,b,c){var regex=/}/g;var str='/})({';return{};}"],
        ["myArray","[{},function(){},\"my'Str\",'my\"Str']"]
    ]
    ```

* Keys with special characters

    ```
    parseObjectLiteral("a.b: 1, b+c: 2, c=d: 3, d_e: 4");
    ```

    ```
    [ ["a.b","1"], ["b+c","2"], ["c=d","3"], ["d_e","4"] ]
    ```

* Keys without values, values without keys, etc.

    ```
    parseObjectLiteral("malformed1, 'mal:formed2', good:3, { malformed: 4 }, good5:5");
    ```

    ```
    [ ["malformed1",null], ["mal:formed2",null], ["good","3"], ["good5","5"] ]
    ```
