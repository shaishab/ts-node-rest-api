class HttpException extends Error {
  public status: number;
  public errors: any[];

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.errors = [{ code, message }]
  }
}

export default HttpException;
