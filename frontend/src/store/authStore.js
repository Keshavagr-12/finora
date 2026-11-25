import { create } from "zustand";

const useAuthStore = create((set) => ({

    user: null,
    isAuthenticated: false,

    setUser: (user) => set({
        user,
        isAuthenticated: Boolean(user)
    }),

    clearUser: () => set({
        user: null,
        isAuthenticated: false
    })

}));

export default useAuthStore;