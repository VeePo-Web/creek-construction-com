/**
 * useApprovedMedia + useProjects — react-query wrappers around public-media.
 *
 * Pages NEVER import images directly anymore. They request a query
 * (e.g. "give me a hero photo for decks") and the system pulls from
 * approved cloud media. Returns [] gracefully when nothing matches —
 * pages must always provide an evergreen fallback.
 */

import { useQuery } from "@tanstack/react-query";
import {
  fetchApprovedMedia,
  fetchProjects,
  type MediaQuery,
  type ApprovedMedia,
  type DBProject,
} from "@/lib/api/public-media";

export function useApprovedMedia(q: MediaQuery = {}): {
  items: ApprovedMedia[];
  loading: boolean;
} {
  const key = ["approved-media", q] as const;
  const { data, isLoading } = useQuery({
    queryKey: key,
    queryFn: () => fetchApprovedMedia(q),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
  return { items: data ?? [], loading: isLoading };
}

export function useFirstApprovedMedia(q: MediaQuery = {}): {
  item: ApprovedMedia | null;
  loading: boolean;
} {
  const { items, loading } = useApprovedMedia({ ...q, limit: 1 });
  return { item: items[0] ?? null, loading };
}

export function useProjects(opts: {
  featured?: boolean;
  service?: string;
  limit?: number;
} = {}): { projects: DBProject[]; loading: boolean } {
  const { data, isLoading } = useQuery({
    queryKey: ["projects", opts],
    queryFn: () => fetchProjects(opts),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
  return { projects: data ?? [], loading: isLoading };
}
