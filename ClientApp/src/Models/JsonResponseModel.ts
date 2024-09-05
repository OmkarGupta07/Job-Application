import { ApiStatus } from "../Helpers/Enums/ApiStatus";

export interface JsonResponseModel {
  Status: ApiStatus;
  Message: string;
  Data: object | Array<object>;
}
