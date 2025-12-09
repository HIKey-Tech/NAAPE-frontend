// Model props based on IEvent model schema
export interface EventCardProps {
    id: string;
    title: string;
    date: string | Date;
    location: string;
    imageUrl?: string;
    description?: string;
    price: number;
    currency: string;
    isPaid: boolean;
    createdBy?: string;
    registeredUsers?: string[];
    payments?: IEventPayment[];
    createdAt?: string | Date;
    updatedAt?: string | Date;
    className?: string;
    registerLabel?: string;
    disabled?: boolean;
}

export interface IEventPayment {
    user?: string;   // ObjectId as string
    guest?: {
        name: string;
        email: string;
    };
    transactionId: string;
    amount: number;
    status: string;
    date: string; // ISO date string
}