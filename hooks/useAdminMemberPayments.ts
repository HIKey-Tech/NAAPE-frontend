import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useAuth } from "@/context/authcontext";

interface MemberPayment {
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
  metadata: any;
  createdAt: string;
}

interface TypeStats {
  _id: string;
  count: number;
  totalAmount: number;
  statuses: string[];
}

interface PaymentStats {
  _id: string;
  count: number;
  totalAmount: number;
}

export const useAdminMemberPayments = (paymentType?: string) => {
  const { token } = useAuth();
  const [payments, setPayments] = useState<MemberPayment[]>([]);
  const [typeStats, setTypeStats] = useState<TypeStats[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMemberPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = paymentType ? { paymentType } : {};
      const response = await axios.get("/payments/admin/members/payments", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      if (response.data.success) {
        setPayments(response.data.payments || []);
      } else {
        setError(response.data.message || "Failed to fetch member payments");
        setPayments([]);
      }
    } catch (err: any) {
      console.error("Error fetching member payments:", err);
      setError(err.response?.data?.message || "Failed to fetch member payments");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberStats = async () => {
    try {
      const response = await axios.get("/payments/admin/members/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setTypeStats(response.data.typeStats || []);
        setPaymentStats(response.data.paymentStats || []);
      }
    } catch (err: any) {
      console.error("Error fetching member stats:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMemberPayments();
      fetchMemberStats();
    }
  }, [token, paymentType]);

  const refetch = () => {
    fetchMemberPayments();
    fetchMemberStats();
  };

  return {
    payments,
    typeStats,
    paymentStats,
    loading,
    error,
    refetch,
  };
};