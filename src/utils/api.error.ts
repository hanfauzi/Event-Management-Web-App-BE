export class ApiError extends Error {
  statusCode: number;
  isExpose: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);

   
    Object.setPrototypeOf(this, ApiError.prototype);

    this.name = this.constructor.name; 
    this.statusCode = statusCode;
    this.isExpose = true;
  }
}