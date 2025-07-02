import { IPaginationMeta } from "../types";

class ApiResponse {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;
  pagination?: IPaginationMeta;

  constructor(
    statusCode: number,
    data: any,
    message = "Success",
    pagination?: IPaginationMeta,
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    this.pagination = pagination;
  }
}

export default ApiResponse;
