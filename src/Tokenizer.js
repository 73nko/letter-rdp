/**
 * Tokenizer class
 *
 * Lazily pulls a token from a stream.
 */
class Tokenizer {
  /**
   * Initializes the string.
   */
  init(string) {
    this._string = string;
    this._cursor = 0;
  }

  isEOF() {
    return this._cursor === this._string.length;
  }

  /**
   * Whether we still have more tokens.
   */
  hasMoreTokens() {
    return this._cursor < this._string.length;
  }

  /**
   * Obtains the next token.
   */
  getNextToken() {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const string = this._string.slice(this._cursor);

    let matched = /^\d+/.exec(string);
    if (matched) {
      this._cursor += matched[0].length;
      return {
        type: "Number",
        value: matched[0],
      };
    }

    // String
    matched = /^"([^"]*)"/.exec(string);
    if (matched) {
      this._cursor += matched[0].length;
      return {
        type: "String",
        value: matched[0],
      };
    }

    return null;
  }
}

module.exports = {
  Tokenizer,
};
