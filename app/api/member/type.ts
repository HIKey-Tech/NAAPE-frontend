export interface IMember {
    _id: string;
    name: string;
    email: string;
    role: "member" | "admin";
    createdAt?: string;
    image?: string; // Optional avatar/image field
}