export type CredentialsDTO = {
  email: string;
  password: string;
};

export type ClientDTO = {
  fullName: string;
} & CredentialsDTO;
