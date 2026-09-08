import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  getAnecdotes,
  createAnecdote,
  updateAnecdote,
} from '../services/anecdotes'

// Hae kaikki anekdootit
export const useAnecdotesQuery = () => {
  return useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
  })
}

// Luo uusi anekdootti
export const useCreateAnecdoteMutation = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      options.onSuccess?.(newAnecdote)
    },
    onError: (error) => {
      options.onError?.(error)
    },
  })
}

// Äänestä anekdoottia
export const useVoteAnecdoteMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updated) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.map(a => a.id !== updated.id ? a : updated)
      )
    },
  })
}
