const { Parser } = require("./Parser")

test("should return an AST Numerical object", () => {
  const parser = new Parser()
  const program = "42;"
  const ast = parser.parse(program)

  expect(ast).toEqual({
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "NumericalLiteral",
          value: 42,
        },
      },
    ],
  })
})

test("should return an AST StringLiteral object", () => {
  const parser = new Parser()
  const program = '"hello";'
  const ast = parser.parse(program)

  expect(ast).toEqual({
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "StringLiteral",
          value: "hello",
        },
      },
    ],
  })
})

test("should return an AST StringLiteral object", () => {
  const parser = new Parser()
  const program = "'hello';"
  const ast = parser.parse(program)

  expect(ast).toEqual({
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "StringLiteral",
          value: "hello",
        },
      },
    ],
  })
})

test("should return an AST StringLiteral object even with white spaces", () => {
  const parser = new Parser()
  const program = "  'hello';   "
  const ast = parser.parse(program)

  expect(ast).toEqual({
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "StringLiteral",
          value: "hello",
        },
      },
    ],
  })
})

test("should return an AST StringLiteral object with comments", () => {
  const parser = new Parser()
  const program = `
  // test comments:
  'hello';
`
  const ast = parser.parse(program)

  expect(ast).toEqual({
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "StringLiteral",
          value: "hello",
        },
      },
    ],
  })
})

test("should return an AST StringLiteral object with multiline comments", () => {
  const parser = new Parser()
  const program = `
  /*
  * test comments:
  */

  'hello';
`
  const ast = parser.parse(program)

  expect(ast).toEqual({
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "StringLiteral",
          value: "hello",
        },
      },
    ],
  })
})

test("A program with multiple statements", () => {
  const parser = new Parser()
  const program = `
  /*
  * test comments:
  */

  'hello';

  // Number
  42;

`
  const ast = parser.parse(program)

  expect(ast).toEqual({
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "StringLiteral",
          value: "hello",
        },
      },
      {
        type: "ExpressionStatement",
        expression: {
          type: "NumericalLiteral",
          value: 42,
        },
      },
    ],
  })
})

test("A program with a blockStatement", () => {
  const parser = new Parser()
  const program = `
  {
    42;
    'hello';
  }

`
  const ast = parser.parse(program)

  expect(ast).toEqual({
    type: "Program",
    body: [
      {
        type: "BlockStatement",
        body: [
          {
            type: "ExpressionStatement",
            expression: {
              type: "NumericalLiteral",
              value: 42,
            },
          },
          {
            type: "ExpressionStatement",
            expression: {
              type: "StringLiteral",
              value: "hello",
            },
          },
        ],
      },
    ],
  })
})

test("A program with a blockStatement empty", () => {
  const parser = new Parser()
  const program = `
  {

  }

`
  const ast = parser.parse(program)

  expect(ast).toEqual({
    type: "Program",
    body: [
      {
        type: "BlockStatement",
        body: [],
      },
    ],
  })
})

test("A program with nested blockStatements", () => {
  const parser = new Parser()
  const program = `
  {
    42;
    {
      "hello";
    }
  }

`
  const ast = parser.parse(program)

  expect(ast).toEqual({
    type: "Program",
    body: [
      {
        type: "BlockStatement",
        body: [
          {
            type: "ExpressionStatement",
            expression: {
              type: "NumericalLiteral",
              value: 42,
            },
          },
          {
            type: "BlockStatement",
            body: [
              {
                type: "ExpressionStatement",
                expression: {
                  type: "StringLiteral",
                  value: "hello",
                },
              },
            ],
          },
        ],
      },
    ],
  })
})

test("A program with an empty statement", () => {
  const parser = new Parser()
  const program = `
  ;

`
  const ast = parser.parse(program)

  expect(ast).toEqual({
    type: "Program",
    body: [
      {
        type: "EmptyStatement",
      },
    ],
  })
})
