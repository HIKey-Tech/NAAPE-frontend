"use client";

import React, { useState } from "react";
import { FaBan, FaClock, FaVolumeMute, FaExclamationTriangle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ForumUser, UserRestrictionData } from "@/app/api/admin/forum";

interface UserRestrictionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: UserRestrictionData) => Promise<boolean>;
    user: ForumUser;
    restrictionType: 'ban' | 'suspend' | 'mute';
    isLoading: boolean;
}

const UserRestrictionModal: React.FC<UserRestrictionModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    user,
    restrictionType,
    isLoading
}) => {
    const [reason, setReason] = useState("");
    const [duration, setDuration] = useState<number | undefined>(undefined);
    const [customDuration, setCustomDuration] = useState("");
    const [errors, setErrors] = useState<{ reason?: string; duration?: string }>({});

    const getModalConfig = () => {
        switch (restrictionType) {
            case 'ban':
                return {
                    title: "Ban User",
                    description: "This will permanently ban the user from the forum. They will not be able to create threads, post replies, or access forum content.",
                    icon: <FaBan className="w-6 h-6 text-red-500" />,
                    actionText: "Ban User",
                    actionClass: "bg-red-600 hover:bg-red-700"
                };
            case 'suspend':
                return {
                    title: "Suspend User",
                    description: "This will temporarily suspend the user from the forum for the specified duration. They will regain access when the suspension expires.",
                    icon: <FaClock className="w-6 h-6 text-orange-500" />,
                    actionText: "Suspend User",
                    actionClass: "bg-orange-600 hover:bg-orange-700"
                };
            case 'mute':
                return {
                    title: "Mute User",
                    description: "This will mute the user, allowing them to read forum content but preventing them from creating threads or posting replies.",
                    icon: <FaVolumeMute className="w-6 h-6 text-yellow-500" />,
                    actionText: "Mute User",
                    actionClass: "bg-yellow-600 hover:bg-yellow-700"
                };
            default:
                return {
                    title: "Restrict User",
                    description: "This will apply restrictions to the user.",
                    icon: <FaExclamationTriangle className="w-6 h-6 text-gray-500" />,
                    actionText: "Apply Restriction",
                    actionClass: "bg-gray-600 hover:bg-gray-700"
                };
        }
    };

    const config = getModalConfig();

    const validateForm = () => {
        const newErrors: { reason?: string; duration?: string } = {};

        if (!reason.trim()) {
            newErrors.reason = "Reason is required";
        }

        if (restrictionType === 'suspend') {
            if (!duration && !customDuration) {
                newErrors.duration = "Duration is required for suspensions";
            } else if (customDuration && (isNaN(Number(customDuration)) || Number(customDuration) <= 0)) {
                newErrors.duration = "Duration must be a positive number";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const finalDuration = duration || (customDuration ? Number(customDuration) : undefined);

        const success = await onSubmit({
            reason: reason.trim(),
            duration: finalDuration
        });

        if (success) {
            handleClose();
        }
    };

    const handleClose = () => {
        setReason("");
        setDuration(undefined);
        setCustomDuration("");
        setErrors({});
        onClose();
    };

    const handleDurationChange = (value: string) => {
        if (value === 'custom') {
            setDuration(undefined);
        } else {
            setDuration(Number(value));
            setCustomDuration("");
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={handleClose}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-3">
                        {config.icon}
                        {config.title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-left">
                        {config.description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4">
                    {/* User Info */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Duration Selection (for suspensions only) */}
                    {restrictionType === 'suspend' && (
                        <div className="space-y-2">
                            <Label htmlFor="duration">Suspension Duration</Label>
                            <Select onValueChange={handleDurationChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 day</SelectItem>
                                    <SelectItem value="3">3 days</SelectItem>
                                    <SelectItem value="7">1 week</SelectItem>
                                    <SelectItem value="14">2 weeks</SelectItem>
                                    <SelectItem value="30">1 month</SelectItem>
                                    <SelectItem value="custom">Custom duration</SelectItem>
                                </SelectContent>
                            </Select>
                            
                            {duration === undefined && (
                                <div className="space-y-2">
                                    <Label htmlFor="customDuration">Custom Duration (days)</Label>
                                    <Input
                                        id="customDuration"
                                        type="number"
                                        min="1"
                                        placeholder="Enter number of days"
                                        value={customDuration}
                                        onChange={(e) => setCustomDuration(e.target.value)}
                                    />
                                </div>
                            )}
                            
                            {errors.duration && (
                                <p className="text-sm text-red-600">{errors.duration}</p>
                            )}
                        </div>
                    )}

                    {/* Reason */}
                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason *</Label>
                        <Textarea
                            id="reason"
                            placeholder={`Explain why you are ${restrictionType === 'ban' ? 'banning' : restrictionType === 'suspend' ? 'suspending' : 'muting'} this user...`}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                        />
                        {errors.reason && (
                            <p className="text-sm text-red-600">{errors.reason}</p>
                        )}
                    </div>

                    {/* Warning */}
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-2">
                            <FaExclamationTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                            <div className="text-sm text-yellow-800">
                                <p className="font-medium">Warning</p>
                                <p>
                                    This action will be logged and the user will be notified. 
                                    {restrictionType === 'ban' && " Permanent bans can only be removed by administrators."}
                                    {restrictionType === 'suspend' && " The user will regain access when the suspension expires."}
                                    {restrictionType === 'mute' && " The user will still be able to read content but cannot post."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <AlertDialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={config.actionClass}
                    >
                        {isLoading ? "Processing..." : config.actionText}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default UserRestrictionModal;