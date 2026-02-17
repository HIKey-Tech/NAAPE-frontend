"use client";

import React, { useState } from "react";
import { FaBan, FaClock, FaVolumeMute, FaExclamationTriangle, FaTimes } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
                    icon: <FaBan className="w-5 h-5 text-red-500" />,
                    iconBg: "bg-red-50",
                    actionText: "Ban User",
                    actionVariant: "destructive" as const,
                };
            case 'suspend':
                return {
                    title: "Suspend User",
                    description: "This will temporarily suspend the user from the forum for the specified duration. They will regain access when the suspension expires.",
                    icon: <FaClock className="w-5 h-5 text-orange-500" />,
                    iconBg: "bg-orange-50",
                    actionText: "Suspend User",
                    actionVariant: "destructive" as const,
                };
            case 'mute':
                return {
                    title: "Mute User",
                    description: "This will mute the user, allowing them to read forum content but preventing them from creating threads or posting replies.",
                    icon: <FaVolumeMute className="w-5 h-5 text-amber-500" />,
                    iconBg: "bg-amber-50",
                    actionText: "Mute User",
                    actionVariant: "destructive" as const,
                };
            default:
                return {
                    title: "Restrict User",
                    description: "This will apply restrictions to the user.",
                    icon: <FaExclamationTriangle className="w-5 h-5 text-slate-500" />,
                    iconBg: "bg-slate-50",
                    actionText: "Apply Restriction",
                    actionVariant: "destructive" as const,
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center`}>{config.icon}</div>
                        <h2 className="text-lg font-bold text-slate-900">{config.title}</h2>
                    </div>
                    <button onClick={handleClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                        <FaTimes className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-500">{config.description}</p>

                    {/* User Info */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-sm text-slate-900">{user.name}</p>
                                <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Duration Selection (for suspensions only) */}
                    {restrictionType === 'suspend' && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Suspension Duration</label>
                            <Select onValueChange={handleDurationChange}>
                                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50">
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
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Custom Duration (days)</label>
                                    <Input
                                        type="number"
                                        min="1"
                                        placeholder="Enter number of days"
                                        value={customDuration}
                                        onChange={(e) => setCustomDuration(e.target.value)}
                                        className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                                    />
                                </div>
                            )}

                            {errors.duration && (
                                <p className="text-xs text-red-600 font-medium">{errors.duration}</p>
                            )}
                        </div>
                    )}

                    {/* Reason */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Reason <span className="text-red-500">*</span></label>
                        <Textarea
                            placeholder={`Explain why you are ${restrictionType === 'ban' ? 'banning' : restrictionType === 'suspend' ? 'suspending' : 'muting'} this user...`}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                        />
                        {errors.reason && (
                            <p className="text-xs text-red-600 font-medium">{errors.reason}</p>
                        )}
                    </div>

                    {/* Warning */}
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                        <div className="flex items-start gap-2">
                            <FaExclamationTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                            <div className="text-xs text-amber-800">
                                <p className="font-bold">Warning</p>
                                <p className="mt-0.5">
                                    This action will be logged and the user will be notified.
                                    {restrictionType === 'ban' && " Permanent bans can only be removed by administrators."}
                                    {restrictionType === 'suspend' && " The user will regain access when the suspension expires."}
                                    {restrictionType === 'mute' && " The user will still be able to read content but cannot post."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-slate-100">
                    <Button variant="outline" onClick={handleClose} disabled={isLoading} className="rounded-xl font-bold border-slate-200">Cancel</Button>
                    <Button variant={config.actionVariant} onClick={handleSubmit} disabled={isLoading} className="rounded-xl font-bold shadow-md shadow-red-600/20">
                        {isLoading ? "Processing..." : config.actionText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UserRestrictionModal;