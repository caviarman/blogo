export interface User {
  email: string;
  password: string;
  returnSecureToken?: boolean;
}

export interface FireBase {
  idToken: string;
  expiresIn: string;
}

export interface Post {
  ID?: number;
  title: string;
  epigraph?: string;
  text: string;
  createdOn: Date;
  updatedOn: Date;
  avatar?: string;
  image?: string;
  preview: string;
  deleted?: boolean;
}

export interface FireCreateResponse {
  name: string;
}
