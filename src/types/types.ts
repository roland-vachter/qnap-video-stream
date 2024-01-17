export interface LoginBody {
  username: string;
  password: string;
}

export interface LoginResponse {
  QDocRoot: {
    authPassed: number;
    authSid: string;
  }
}

export interface Cookies {
  sid: string;
}

export interface FolderResponse {
  text: string;
}

export interface FileApiResponse {
  datas: FileResponse[];
}

export interface FileResponse {
  filename: string;
}
