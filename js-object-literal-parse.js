// Javascript object literal parser
// Splits an object literal string into a set of top-level key-value pairs
// (c) Michael Best (https://github.com/mbest)
// License: MIT (http://www.opensource.org/licenses/mit-license.php)
// Version 1.0.0

var parseObjectLiteral = (function(undefined) {
    // This parser is inspired by json-sans-eval by Mike Samuel (http://code.google.com/p/json-sans-eval/)

    // Match strings with either single or double quotes
    var stringDouble = '(?:"(?:[^"\\\\]|\\\\.)*")';
    var stringSingle = "(?:'(?:[^'\\\\]|\\\\.)*')";
    // Match regular expressions
    var stringRegexp = '(?:/(?:[^/\\\\]|\\\\.)*/)';
    // Match sequences that don't contain these special characters (except as an initial character)
    // and don't start or end with a space
    var specials = ',"\'{}()/:[\\]';
    var everyThingElse = '(?:[^\\s:,][^' + specials + ']*[^\\s' + specials + '])';
    var oneNotSpace = '[^\\s]';

    var token = RegExp(
        '(?:' + stringDouble
        + '|' + stringSingle
        + '|' + stringRegexp
        + '|' + everyThingElse
        + '|' + oneNotSpace
        + ')', 'g');

    var nativeTrim = String.prototype.trim;
    function trim(str) {
        return str == null ? ""
            : nativeTrim
                ? nativeTrim.call(str)
                : str.toString().replace(/^\s+/, '').replace(/\s+$/, '');
    }

    return function(objectLiteralString) {
        // Trim leading and trailing spaces from the string
        var str = trim(objectLiteralString);

        // Trim braces '{' surrounding the whole object literal
        if (str.charCodeAt(0) === 123)
            str = str.slice(1, -1);

        // Split into tokens
        var result = [],
            toks = str.match(token),
            key, values, depth = 0;

        if (toks) {
            // Append a comma so that we don't need a separate code block to deal with the last item
            toks.push(',');

            for (var i = 0, n = toks.length; i < n; ++i) {
                var tok = toks[i], c = tok.charCodeAt(0);
                // A comma signals the end of a key/value pair if depth is zero
                if (c === 44) { // ","
                    if (depth <= 0) {
                        if (key)
                            result.push([key, values ? values.join('') : undefined]);
                        key = values = depth = 0;
                        continue;
                    }
                // Simply skip the colon that separates the name and value
                } else if (c === 58) { // ":"
                    if (!values)
                        continue;
                // Increment depth for parentheses, braces, and brackets so that interior commas are ignored
                } else if (c === 40 || c === 123 || c === 91) { // '(', '{', '['
                    ++depth;
                } else if (c === 41 || c === 125 || c === 93) { // ')', '}', ']'
                    --depth;
                // The key must be a single token; if it's a string, trim the quotes
                } else if (!key && !values) {
                    key = (c === 34 || c === 39) // '"', "'"
                        ? tok.slice(1, -1)
                        : tok;
                    continue;
                }
                if (values)
                    values.push(tok);
                else
                    values = [tok];
            }
        }
        return result;
    }
})();
