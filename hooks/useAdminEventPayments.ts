import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useAuth } from "@/context/authcontext";

interface EventPayment {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
  };
  type: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  metadata: {
    eventId: string;
    eventTitle: string;
  };
  eventDetails?: {
    _id: string;
    title: string;
    date: string;
    location: string;
    price: number;
  };
  createdAt: string;
}

interface EventStats {
  _id: string;
  eventTitle: string;
  count: number;
  totalAmount: number;
  statuses: string[];
}

interface PaymentStats {
  _id: string;
  count: number;
  totalAmount: number;
}

export const useAdminEventPayments = (eventId?: string) => {
  const { token } = useAuth();
  const [payments, setPayments] = useState<EventPayment[]>([]);
  const [eventStats, setEventStats] = useState<EventStats[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEventPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = eventId ? { eventId } : {};
      const response = await axios.get("/payments/admin/events/payments", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      if (response.data.success) {
        setPayments(response.data.payments);
      } else {
        setError(response.data.message || "Failed to fetch event payments");
      }
    } catch (err: any) {
      console.error("Error fetching event payments:", err);
      setError(err.response?.data?.message || "Failed to fetch event payments");
    } finally {
      setLoading(false);
    }
  };

  const fetchEventStats = async () => {
    try {
      const response = await axios.get("/payments/admin/events/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setEventStats(response.data.eventStats);
        setPaymentStats(response.data.paymentStats);
      }
    } catch (err: any) {
      console.error("Error fetching event stats:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchEventPayments();
      fetchEventStats();
    }
  }, [token, eventId]);

  const refetch = () => {
    fetchEventPayments();
    fetchEventStats();
  };

  return {
    payments,
    eventStats,
    paymentStats,
    loading,
    error,
    refetch,
  };
};