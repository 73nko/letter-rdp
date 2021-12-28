const { Parser } = require("../src/Parser")

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

// eslint-disable-next-line no-console
console.log(JSON.stringify(ast, null, 2))
