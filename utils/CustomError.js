class CustomError extends Error {
  constructor(name, value = null) {
    super(value);
    this.name = name;
    this.value = value;
    this.message = 'record not found';
  }
}

module.exports = CustomError;
