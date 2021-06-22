import {InjectionToken} from "@angular/core";
import {environment} from "../../environments/environment";

export const BASE_URL = new InjectionToken<string>("Base Url for Endpoint", {
  providedIn: "root",
  factory: () => environment.baseUrl
})
