import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchComments,
  addComment,
  deleteComment,
} from "@/app/api/comments/comment";

// Query: Fetch comments for a publication
export function useComments(publicationId: string) {
  return useQuery({
    queryKey: ["comments", publicationId],
    queryFn: () => fetchComments(publicationId),
    enabled: !!publicationId,
  });
}

// Mutation: Add a comment to a publication
export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addComment,
    onSuccess: (data, variables) => {
      // Optimistically update the comment list with the new comment data
      queryClient.setQueryData(["comments", variables.publicationId], (old: any) => {
        if (!old || !data) return old;
        return {
          ...old,
          comments: [data, ...(old.comments || [])],
        };
      });
    },
  });
}

// Mutation: Delete a comment
export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: (_data, commentId) => {
      // Optimistically remove the deleted comment from the cache
      // Find all cached comment queries and remove the deleted comment from lists
      queryClient
        .getQueriesData({ queryKey: ["comments"] })
        .forEach(([key, value]: any) => {
          if (value?.comments && Array.isArray(value.comments)) {
            // Check if the comment to delete exists
            if (value.comments.some((c: any) => c.id === commentId)) {
              queryClient.setQueryData(key, {
                ...value,
                comments: value.comments.filter(
                  (comment: any) => comment.id !== commentId
                ),
              });
            }
          }
        });
    },
  });
}
