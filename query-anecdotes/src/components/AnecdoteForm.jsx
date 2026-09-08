import { useCreateAnecdoteMutation } from '../hooks/useAnecdotes'
import { useNotify } from '../NotificationContext'

const AnecdoteForm = () => {
  const notify = useNotify()

  const createMutation = useCreateAnecdoteMutation({
    onSuccess: (newAnecdote) => {
      notify(`anecdote '${newAnecdote.content}' created`)
    },
    onError: () => {
      notify('too short anecdote, must have length 5 or more')
    },
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.reset()
    createMutation.mutate(content)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
