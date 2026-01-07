import { create } from "zustand";

type PublicationId = string;

interface PublicationUIState {
    /** Tracks which publication comment panels are open */
    openComments: Record<PublicationId, boolean>;

    /** Optional: currently focused publication */
    activePublicationId: PublicationId | null;

    /** Actions */
    toggleComments: (publicationId: PublicationId) => void;
    openCommentsFor: (publicationId: PublicationId) => void;
    closeCommentsFor: (publicationId: PublicationId) => void;
    closeAllComments: () => void;

    setActivePublication: (publicationId: PublicationId | null) => void;
}

export const usePublicationUIStore = create<PublicationUIState>((set) => ({
    openComments: {},
    activePublicationId: null,

    toggleComments: (publicationId) =>
        set((state) => ({
            openComments: {
                ...state.openComments,
                [publicationId]: !state.openComments[publicationId],
            },
        })),

    openCommentsFor: (publicationId) =>
        set((state) => ({
            openComments: {
                ...state.openComments,
                [publicationId]: true,
            },
        })),

    closeCommentsFor: (publicationId) =>
        set((state) => ({
            openComments: {
                ...state.openComments,
                [publicationId]: false,
            },
        })),

    closeAllComments: () =>
        set(() => ({
            openComments: {},
        })),

    setActivePublication: (publicationId) =>
        set(() => ({
            activePublicationId: publicationId,
        })),
}));
