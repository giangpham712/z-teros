export interface ApiResponse<T = any> {
  error?: any;
  data?: T;
}
