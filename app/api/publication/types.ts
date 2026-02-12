export interface IPublication {
    _id: string;
    title: string;
    content: string;
    category: "Engineering" | "Pilot" | "News" | "General";
    image?: string;
    author: {
        _id: string;
        name: string;
        email: string;
        role: string;
    };
    status: "draft" | "pending" | "approved" | "rejected";
    createdAt: string;
    updatedAt: string;
}
