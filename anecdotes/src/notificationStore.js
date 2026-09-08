import { create } from 'zustand'

// timeoutId säilyy moduulitasolla, jotta uusi notifikaatio
// nollaa aiemman timeoutin ja pidentää näkyvyysaikaa
let timeoutId = null

const useNotificationStore = create((set) => ({
  message: null,

  notify: (message, duration = 5000) => {
    if (timeoutId) clearTimeout(timeoutId)
    set({ message })
    timeoutId = setTimeout(() => set({ message: null }), duration)
  },

  clear: () => {
    if (timeoutId) clearTimeout(timeoutId)
    set({ message: null })
  },
}))

export default useNotificationStore
