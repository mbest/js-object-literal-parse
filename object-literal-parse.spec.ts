import parseObjectLiteral from "./object-literal-parse";

it("should be able to parse simple object literals", () => {
  const result = parseObjectLiteral(
    "a: 1, b: 2, \"quotedKey\": 3, 'aposQuotedKey': 4"
  );
  expect(result).toEqual([
    ["a", "1"],
    ["b", "2"],
    ["quotedKey", "3"],
    ["aposQuotedKey", "4"],
  ]);
});

it("should be able to parse simple object literals", () => {
  const result = parseObjectLiteral("{a: 1}");
  expect(result).toEqual([["a", "1"]]);
});

it("should be able to parse object literals containing string literals", () => {
  const result = parseObjectLiteral(
    "a: \"comma, colon: brace{ bracket[ apos' escapedQuot\\\" end\", b: 'escapedApos\\' brace} bracket] quot\"'"
  );
  expect(result).toEqual([
    ["a", '"comma, colon: brace{ bracket[ apos\' escapedQuot\\" end"'],
    ["b", "'escapedApos\\' brace} bracket] quot\"'"],
  ]);
});

it("should be able to parse object literals containing child objects, arrays, function literals, and newlines", () => {
  const result = parseObjectLiteral(
    "myObject:{someChild:{}, someChildArray:[1,2,3], \"quotedChildProp\":'string value'},\n" +
      "someFn:function(a,b,c){var regex=/{/g;var str='/})({';return{};}," +
      "myArray:[{}, function(){}, \"my'Str\", 'my\"Str']"
  );
  expect(result).toEqual([
    [
      "myObject",
      "{someChild:{},someChildArray:[1,2,3],\"quotedChildProp\":'string value'}",
    ],
    ["someFn", "function(a,b,c){var regex=/{/g;var str='/})({';return{};}"],
    ["myArray", "[{},function(){},\"my'Str\",'my\"Str']"],
  ]);
});

it("should be able to parse object literals containing division and not confuse it with regular expressions", () => {
  const result = parseObjectLiteral("c: null / 0, a: 2 / 1, b: (3) / 2");
  expect(result).toEqual([
    ["c", "null/0"],
    ["a", "2/1"],
    ["b", "(3)/2"],
  ]);
});

it("should be able to parse object literals containing division and regular expressions", () => {
  const result = parseObjectLiteral(
    "div: null/0, regexpFunc: function(){var regex=/{/g;return /123/;}"
  );
  expect(result).toEqual([
    ["div", "null/0"],
    ["regexpFunc", "function(){var regex=/{/g;return/123/;}"],
  ]);
});

it("Should be able to correctly parse slashes in certain problem cases when parentheses are used", () => {
  const result = parseObjectLiteral(
    "a: (function() {}) / 1, b: function () { if (true) (/ abc /).test('123'); }, c: function () { throw (/ xyz /); }"
  );
  expect(result).toEqual([
    ["a", "(function(){})/1"],
    ["b", "function(){ if(true)(/ abc /).test('123');}"],
    ["c", "function(){ throw(/ xyz /);}"],
  ]);
});

it("Should be able to parse unquoted keys with some special characters", () => {
  const result = parseObjectLiteral("a.b: 1, b+c: 2, c=d: 3, d_e: 4");
  expect(result).toEqual([
    ["a.b", "1"],
    ["b+c", "2"],
    ["c=d", "3"],
    ["d_e", "4"],
  ]);
});

it("Should parse a value that begins with a colon", () => {
  const result = parseObjectLiteral("a: :-)");
  expect(result).toEqual([["a", ":-)"]]);
});

it("Should be able to cope with malformed syntax (things that aren't key-value pairs)", () => {
  const result = parseObjectLiteral(
    "malformed1, 'mal:formed2', good:3, {malformed:4}, good5:5, keyonly:"
  );
  expect(result).toEqual([
    ["malformed1", undefined],
    ["mal:formed2", undefined],
    ["good", "3"],
    ["good5", "5"],
    ["keyonly", undefined],
  ]);
});
