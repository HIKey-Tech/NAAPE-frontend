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
    payments?: {
        user: string;
        transactionId: string;
        amount: number;
        status: string;
        date: string | Date;
    }[];
    createdAt?: string | Date;
    updatedAt?: string | Date;
    className?: string;
    registerLabel?: string;
    disabled?: boolean;
}