export class BaseResponse {
  statusCode: number;
  success: boolean | string;
  data: any;

  constructor(statusCode: number, success: boolean | string, data: any) {
    this.statusCode = statusCode;
    this.success = success;
    this.data = data;
  }
}

export class SuccessResponse extends BaseResponse {
  constructor(field: string, message: string) {
    super(200, true, { [field]: message });
  }
}
