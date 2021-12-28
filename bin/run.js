const { Parser } = require("../src/Parser")

const parser = new Parser()
const program = `
  {
    42;
    'hello';
  }

`
const ast = parser.parse(program)

// eslint-disable-next-line no-console
console.log(JSON.stringify(ast, null, 2))
