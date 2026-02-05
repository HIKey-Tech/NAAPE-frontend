"use client";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/context/authcontext";
import { useState } from "react";

interface GoogleSignInButtonProps {
    onSuccess?: () => void;
    text?: "signin_with" | "signup_with" | "continue_with";
}

export default function GoogleSignInButton({ 
    onSuccess, 
    text = "signin_with" 
}: GoogleSignInButtonProps) {
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        setIsLoading(true);
        
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            
            const response = await axios.post(`${baseUrl}/api/v1/auth/google`, {
                credential: credentialResponse.credential
            }, {
                timeout: 15000
            });

            if (response.data.success) {
                // Use the auth context login function to update state
                login(response.data.user, response.data.token);

                toast.success("Successfully signed in with Google!");

                // Determine redirect path
                const redirectPath = response.data.user.role === "admin" 
                    ? "/admin/dashboard" 
                    : "/dashboard";
                
                // Use window.location for full page navigation
                window.location.href = redirectPath;

                if (onSuccess) {
                    onSuccess();
                }
            }
        } catch (error: any) {
            console.error("Google Sign-In Error:", error);
            setIsLoading(false);
            
            if (error.code === 'ECONNABORTED') {
                toast.error("Request timeout. Please try again.");
            } else {
                toast.error(error.response?.data?.message || "Google sign-in failed");
            }
        }
    };

    const handleGoogleError = () => {
        toast.error("Google sign-in was cancelled or failed");
    };

    return (
        <>
            {/* Full-screen loading overlay */}
            {isLoading && (
                <div className="fixed inset-0 z-[9999] bg-white/95 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-800">Signing you in...</p>
                            <p className="text-sm text-gray-500 mt-1">Please wait</p>
                        </div>
                    </div>
                </div>
            )}

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
        </>
    );
}
