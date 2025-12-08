import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

type SuggestType = "news" | "publication" | "event";

interface AiSuggestParams {
  type: SuggestType;
  content: string;
}

interface AiSuggestResponse {
  titles: string[];
}

async function fetchAiTitles(params: AiSuggestParams): Promise<AiSuggestResponse> {
  // Use POST with params to `/api/suggest-title`
  const res = await api.post(`/suggest-title`, {
    type: params.type,
    text: params.content,
  });

  // Axios always resolves (unless network error), so check for expected data
  if (!res.data || !res.data.titles) {
    throw new Error("Failed to get AI suggestions");
  }

  return res.data as AiSuggestResponse;
}

/**
 * React Query mutation hook for getting AI title suggestions
 * Provides a convenient "run" alias for "mutate".
 * Usage: 
 *   const { run, data, error, isPending, reset } = useAiSuggest();
 *   run({ type: "news", content: "..." });
 */
export function useAiSuggest() {
  const mutation = useMutation<AiSuggestResponse, Error, AiSuggestParams>({
    mutationFn: fetchAiTitles,
  });

  // Provide a "run" alias for "mutate" for compatibility
  return {
    ...mutation,
    run: mutation.mutate as typeof mutation.mutate,
  } as typeof mutation & { run: typeof mutation.mutate };
}
