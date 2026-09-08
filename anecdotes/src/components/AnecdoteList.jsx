import useAnecdoteStore from '../store'
import useNotificationStore from '../notificationStore'

const AnecdoteList = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)
  const vote = useAnecdoteStore((state) => state.vote)
  const removeAnecdote = useAnecdoteStore((state) => state.removeAnecdote)
  const notify = useNotificationStore((state) => state.notify)

  const filtered = anecdotes
    .filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))

  const sorted = filtered.toSorted((a, b) => b.votes - a.votes)

  const handleVote = async (anecdote) => {
    await vote(anecdote.id)
    notify(`you voted '${anecdote.content}'`)
  }

  const handleRemove = async (anecdote) => {
    await removeAnecdote(anecdote.id)
    notify(`deleted '${anecdote.content}'`)
  }

  return (
    <div>
      {sorted.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            {' '}
            <button onClick={() => handleVote(anecdote)}>vote</button>
            {anecdote.votes === 0 && (
              <button onClick={() => handleRemove(anecdote)}>delete</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
