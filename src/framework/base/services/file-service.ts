import {
  autoinject
} from "aurelia-framework";
import {
  AuthorizationService
} from "./authorization-service";
import {
  RestService
} from "./rest-service";

@autoinject
export class FileService {
  constructor(
    private authorization: AuthorizationService,
    private rest: RestService
  ) {}

  getDownloadUrl(key: string) {
    if (!key) {
      return null;
    }
    
    let authKey = this.authorization.getAuthorizationKey();
    if (authKey) {
      authKey = `&authKey=${encodeURIComponent(authKey)}`;
    }

    return this.rest.getApiUrl(`base/File/Download?key=${key}${authKey}`);
  }
  getInlineUrl(key: string) {
    if (!key) {
      return null;
    }
    
    let authKey = this.authorization.getAuthorizationKey();
    if (authKey) {
      authKey = `&authKey=${encodeURIComponent(authKey)}`;
    }

    return this.rest.getApiUrl(`base/File/Inline?key=${key}${authKey}`);
  }
  download(key: string) {
    const downloadUrl = this.getDownloadUrl(key);
    window.open(downloadUrl, "_blank");
  }
  upload(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    return this.rest.post({
      url: this.rest.getApiUrl("base/File/Upload"),
      data: formData
    });
  }  
}