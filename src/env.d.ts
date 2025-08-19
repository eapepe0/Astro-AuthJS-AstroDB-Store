interface User {
  name: string;
  email: string;
  // TODO: expandirlo
}

declare namespace App {
  interface Locals {
    isLoggedIn: boolean;
    isAdmin: boolean;
    user: User | null;
  }
}
