export class BaseResponse {
  statusCode: number;
  success: boolean | string;
  data: any;
  meta?: any; // optional metadata

  constructor(
    statusCode: number,
    success: boolean | string,
    data: any,
    meta?: any,
  ) {
    this.statusCode = statusCode;
    this.success = success;
    this.data = data;
    if (meta) {
      this.meta = meta;
    }
  }
}

export class SuccessResponse extends BaseResponse {
  constructor(data: any, meta?: any) {
    super(200, true, data, meta);
  }
}
