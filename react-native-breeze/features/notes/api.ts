import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import http from '@/utils/http';

import type {
    Category,
    CreateNoteInput,
    Note,
    NotesQueryParams,
    UpdateNoteInput,
} from './types';

// Query Keys
export const noteKeys = {
    all: ['notes'] as const,
    lists: () => [...noteKeys.all, 'list'] as const,
    list: (filters: NotesQueryParams) => [...noteKeys.lists(), filters] as const,
    details: () => [...noteKeys.all, 'detail'] as const,
    detail: (id: number) => [...noteKeys.details(), id] as const,
};

export const categoryKeys = {
    all: ['categories'] as const,
};

// Fetch notes with optional filters
export function useNotesQuery(
    params: NotesQueryParams = {},
    token?: string | null
) {
    return useQuery({
        queryKey: noteKeys.list(params),
        queryFn: async () => {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    searchParams.append(key, String(value));
                }
            });

            const url = `notes${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
            return http
                .get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .json<Note[]>();
        },
        enabled: !!token,
    });
}

// Fetch single note
export function useNoteQuery(id: number, token?: string | null) {
    return useQuery({
        queryKey: noteKeys.detail(id),
        queryFn: async () => {
            return http
                .get(`notes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .json<Note>();
        },
        enabled: !!token && id > 0,
    });
}

// Create note
export function useCreateNoteMutation(token?: string | null) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateNoteInput) => {
            return http
                .post('notes', {
                    json: data,
                    headers: { Authorization: `Bearer ${token}` },
                })
                .json<Note>();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
        },
    });
}

// Update note
export function useUpdateNoteMutation(token?: string | null) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: UpdateNoteInput }) => {
            return http
                .put(`notes/${id}`, {
                    json: data,
                    headers: { Authorization: `Bearer ${token}` },
                })
                .json<Note>();
        },
        onSuccess: (note) => {
            queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
            queryClient.invalidateQueries({ queryKey: noteKeys.detail(note.id) });
        },
    });
}

// Delete note
export function useDeleteNoteMutation(token?: string | null) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            return http
                .delete(`notes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .json<{ message: string }>();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
        },
    });
}

// Fetch categories
export function useCategoriesQuery(token?: string | null) {
    return useQuery({
        queryKey: categoryKeys.all,
        queryFn: async () => {
            return http
                .get('categories', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .json<Category[]>();
        },
        enabled: !!token,
    });
}
