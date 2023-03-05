export class ZterosError extends Error {
  constructor(errorJson: JSON) {
    const errorMsg = errorJson['Error Message'] || JSON.stringify(errorJson);
    super(errorMsg);
    Object.setPrototypeOf(this, ZterosError.prototype);
  }
}
