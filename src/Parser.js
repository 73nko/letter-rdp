/**
 * Letter Parser: Recursive descent implementation of the parser.
 */

class Parser {
  /**
   * Parers the given input string into a AST.
   * @param {string} input - The input string to parse.
   * @return {AST} - The AST.
   */
  parse(input) {
    this._input = input;

    // Parse recursively starting from the main
    // entry point of the program.
    return this.Program();
  }

  /**
   * Main entry point for the parser.
   *
   * Program
   *  : NumericalLiteral
   */
  Program() {
    return {
      type: "Program",
      body: this.NumericalLiteral(),
    };
  }

  /**
   * NumericalLiteral
   * : Number
   */
  NumericalLiteral() {
    return {
      type: "NumericalLiteral",
      value: Number(this._input),
    };
  }
}

module.exports = {
  Parser,
};
