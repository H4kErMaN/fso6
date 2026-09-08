import useAnecdoteStore from '../store'
import useNotificationStore from '../notificationStore'

const AnecdoteForm = () => {
  const addAnecdote = useAnecdoteStore((state) => state.addAnecdote)
  const notify = useNotificationStore((state) => state.notify)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    await addAnecdote(content)
    notify(`you created '${content}'`)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
