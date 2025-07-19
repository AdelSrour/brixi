export interface IBuilderResponse {
  status: boolean;
  message: string;
  url?: string; // Optional, in case the response does not include a URL
}
