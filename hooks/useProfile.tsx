import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyProfile, updateMyProfile, updateMyPassword } from "@/app/api/profile/profile";

// Query: get my profile
export function useMyProfile() {
  return useQuery({
    queryKey: ["myProfile"],
    queryFn: getMyProfile,
  });
}

// Mutation: update my profile details
export function useUpdateMyProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

// Mutation: update my password
export function useUpdateMyPassword() {
  return useMutation({
    mutationFn: updateMyPassword,
  });
}
