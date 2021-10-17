export type ApiResponse<T, B extends any = T> = {
  status: boolean;
  response: T extends true ? T : B;
}
