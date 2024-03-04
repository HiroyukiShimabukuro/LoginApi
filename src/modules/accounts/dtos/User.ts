class User {
  id: number | null;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  token?: string;
  constructor() {
    this.id = null;
    this.name = "";
    this.email = "";
    this.password = "";
    this.created_at = new Date();
  }
}

export { User };
