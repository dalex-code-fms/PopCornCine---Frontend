export class RegisterCredentials {
  constructor(
    public email: string,
    public password: string,
    public firstName: string,
    public lastName: string,
    public age: number,
    public phone: string,
    public description?: string,
    public photoUrl?: string
  ) {}
}
