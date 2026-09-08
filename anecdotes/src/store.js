import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',

  initialize: async () => {
    const anecdotes = await anecdoteService.getAll()
    set({ anecdotes })
  },

  // Tila päivitetään heti, jotta peräkkäiset klikkaukset eivät ehdi
  // lukea vanhentunutta äänimäärää backendin vastausta odotellessa
  vote: async (id) => {
    const target = get().anecdotes.find(a => a.id === id)
    if (!target) return

    const updated = { ...target, votes: target.votes + 1 }

    set((state) => ({
      anecdotes: state.anecdotes.map(a => a.id !== id ? a : updated),
    }))

    await anecdoteService.update(updated)
  },

  addAnecdote: async (content) => {
    const created = await anecdoteService.create(content)
    set((state) => ({
      anecdotes: state.anecdotes.concat(created),
    }))
  },

  removeAnecdote: async (id) => {
    await anecdoteService.remove(id)
    set((state) => ({
      anecdotes: state.anecdotes.filter(a => a.id !== id),
    }))
  },

  setFilter: (value) => set({ filter: value }),
}))

// Lista saa anekdootit valmiiksi suodatettuna ja äänimäärän mukaan lajiteltuna
export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)

export default useAnecdoteStore
