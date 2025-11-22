import api from "@/lib/axios";

export const fetchComments = async (publicationId: string) => {
    const res = await api.get(`/comments/${publicationId}`);
    return res.data.data;
};

export const addComment = async ({
    publicationId,
    text,
}: {
    publicationId: string;
    text: string;
}) => {
    const res = await api.post(`/comments/${publicationId}`, { text });
    return res.data.data;
};
export const deleteComment = async (commentId: string) => {
    const res = await api.delete(`/comments/${commentId}`);
    return res.data.data;
};