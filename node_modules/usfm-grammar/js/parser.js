// ABSTARCT class

class Parser {
  constructor() {
    if (this.constructor === Parser) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  static validate() {
    throw new Error("Method 'validate()' must be implemented.");
  }

  static noramlize() {
    throw new Error("Method 'noramlize()' must be implemented.");
  }

  static convert() {
    throw new Error("Method 'convert()' must be implemented.");
  }
}

exports.Parser = Parser;
