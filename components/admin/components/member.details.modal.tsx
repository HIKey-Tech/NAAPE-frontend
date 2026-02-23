"use client";

import React from "react";
import { FaTimes, FaCalendarAlt, FaEnvelope, FaUserTag, FaShieldAlt } from "react-icons/fa";
import { IMember } from "@/app/api/member/type";

interface MemberDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    member: IMember | null;
}

const getInitials = (name: string) =>
    name ? name.trim().split(/\s+/).map((w) => w[0]).join("").substring(0, 2).toUpperCase() : "";

const MemberDetailsModal: React.FC<MemberDetailsModalProps> = ({
    isOpen,
    onClose,
    member
}) => {
    if (!isOpen || !member) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 relative">
                    <h2 className="text-xl font-bold text-slate-900">Member Details</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors absolute top-6 right-6"
                    >
                        <FaTimes className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="flex flex-col items-center justify-center">
                        {member.image ? (
                            <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/10 mb-4" />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-lg text-white font-bold text-3xl mb-4">
                                {getInitials(member.name)}
                            </div>
                        )}
                        <h3 className="text-2xl font-bold text-slate-900">{member.name}</h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">{member.email}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <FaUserTag />
                                </div>
                                <span className="text-sm font-semibold text-slate-700">Role</span>
                            </div>
                            <span className="capitalize text-sm font-bold text-slate-900">
                                {member.role === "admin" && <FaShieldAlt className="inline mr-1 text-emerald-600" />}
                                {member.role}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                    <FaCalendarAlt />
                                </div>
                                <span className="text-sm font-semibold text-slate-700">Joined</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900">
                                {new Date(member.createdAt!).toLocaleDateString(undefined, {
                                    year: "numeric", month: "long", day: "numeric"
                                })}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                    <FaEnvelope />
                                </div>
                                <span className="text-sm font-semibold text-slate-700">Email</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900">{member.email}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberDetailsModal;
