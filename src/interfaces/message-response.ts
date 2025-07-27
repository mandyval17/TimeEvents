export default interface MessageResponse {
  data: null | object | number | string | Array<any>;
  message: string;
  dataCount?: number;
}
