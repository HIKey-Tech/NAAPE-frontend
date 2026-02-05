"use client";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/authcontext";

interface GoogleSignInButtonProps {
    onSuccess?: () => void;
    text?: "signin_with" | "signup_with" | "continue_with";
}

export default function GoogleSignInButton({ 
    onSuccess, 
    text = "signin_with" 
}: GoogleSignInButtonProps) {
    const router = useRouter();
    const { login } = useAuth();

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            
            const response = await axios.post(`${baseUrl}/api/v1/auth/google`, {
                credential: credentialResponse.credential
            });

            if (response.data.success) {
                // Use the auth context login function to update state
                login(response.data.user, response.data.token);

                toast.success("Successfully signed in with Google!");

                // Redirect based on role
                if (response.data.user.role === "admin") {
                    router.push("/admin/dashboard");
                } else {
                    router.push("/dashboard");
                }

                if (onSuccess) {
                    onSuccess();
                }
            }
        } catch (error: any) {
            console.error("Google Sign-In Error:", error);
            toast.error(error.response?.data?.message || "Google sign-in failed");
        }
    };

    const handleGoogleError = () => {
        toast.error("Google sign-in was cancelled or failed");
    };

    return (
        <div className="w-full flex justify-center">
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text={text}
                shape="rectangular"
                size="large"
                theme="outline"
            />
        </div>
    );
}
