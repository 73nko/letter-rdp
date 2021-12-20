const { Parser } = require("./Parser");

test("should return an AST Numerical object", () => {
  const parser = new Parser();
  const program = `42`;
  const ast = parser.parse(program);

  expect(ast).toEqual({
    type: "Program",
    body: {
      type: "NumericalLiteral",
      value: 42,
    },
  });
});

test("should return an AST StringLiteral object", () => {
  const parser = new Parser();
  const program = `"hello"`;
  const ast = parser.parse(program);

  expect(ast).toEqual({
    type: "Program",
    body: {
      type: "StringLiteral",
      value: "hello",
    },
  });
});

test("should return an AST StringLiteral object", () => {
  const parser = new Parser();
  const program = `'hello'`;
  const ast = parser.parse(program);

  expect(ast).toEqual({
    type: "Program",
    body: {
      type: "StringLiteral",
      value: "hello",
    },
  });
});
