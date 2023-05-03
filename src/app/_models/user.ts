export enum Role {
    staff = 'staff',
    manager = 'manager',
    owner = 'owner',
}

export class User {
    id: string;
    username: string;
   // user_name: string ;
    password?: string;
    firstname: string;
    address: string ;
    lastname: string;
    authdata?: string;
    mobile: string;
    email:string;
    isAdmin?: Role;
    isActive: boolean;
}

export class UserRes extends User {
    success: string ;
    data: User;
    token: string;
    message?: string;
}
