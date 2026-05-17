import { create } from 'zustand'

const useErrorStore = create((set, get) => ({
  errors:        [],
  selectedError: null,
  analytics:     null,
  loading:       false,
  totalPages:    1,
  currentPage:   1,

  setErrors: (errors) => set({ errors }),

  // prepend a live error from Socket.io to the top of the list
  addLiveError: (error) => set((state) => {
    // check if this error already exists (duplicate fingerprint)
    const exists = state.errors.find(e => e._id === error._id)
    if (exists) {
      // update occurrence count
      return {
        errors: state.errors.map(e =>
          e._id === error._id ? { ...e, occurrences: error.occurrences, lastSeenAt: error.lastSeenAt } : e
        ),
      }
    }
    // new error — add to top
    return { errors: [error, ...state.errors] }
  }),

  setSelectedError: (error) => set({ selectedError: error }),
  setAnalytics:     (analytics) => set({ analytics }),
  setLoading:       (loading)   => set({ loading }),

  // update a single error's status in the list
  updateErrorStatus: (errorId, status) => set((state) => ({
    errors: state.errors.map(e =>
      e._id === errorId ? { ...e, status } : e
    ),
    selectedError: state.selectedError?._id === errorId
      ? { ...state.selectedError, status }
      : state.selectedError,
  })),
}))

export default useErrorStore