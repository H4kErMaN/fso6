import { test, expect, describe, beforeEach, vi } from 'vitest'
import useAnecdoteStore from '../store'
import anecdoteService from '../services/anecdotes'

// Mockataan koko anecdotes-palvelu — testit eivät saa käyttää oikeaa backendia
vi.mock('../services/anecdotes')

const initialAnecdotes = [
  { id: '1', content: 'test anecdote 1', votes: 3 },
  { id: '2', content: 'test anecdote 2', votes: 1 },
  { id: '3', content: 'test anecdote 3', votes: 7 },
]

describe('anecdote store', () => {
  beforeEach(() => {
    // Nollataan store jokaisen testin välissä
    useAnecdoteStore.setState({ anecdotes: [], filter: '' })

    // Mockataan servicen metodit
    anecdoteService.getAll = vi.fn().mockResolvedValue(initialAnecdotes)
    anecdoteService.create = vi.fn().mockImplementation(async (content) => ({
      id: '4', content, votes: 0,
    }))
    anecdoteService.update = vi.fn().mockImplementation(async (a) => a)
    anecdoteService.remove = vi.fn().mockResolvedValue(undefined)
  })

  test('6.12: initializes state with anecdotes from backend', async () => {
    await useAnecdoteStore.getState().initialize()

    const anecdotes = useAnecdoteStore.getState().anecdotes
    expect(anecdotes).toEqual(initialAnecdotes)
    expect(anecdoteService.getAll).toHaveBeenCalledTimes(1)
  })

  test('6.15: voting increments the vote count', async () => {
    // Alustetaan store tunnetuilla anekdooteilla
    useAnecdoteStore.setState({ anecdotes: initialAnecdotes })

    await useAnecdoteStore.getState().vote('1')

    const updated = useAnecdoteStore.getState().anecdotes.find(a => a.id === '1')
    expect(updated.votes).toBe(4)
    expect(anecdoteService.update).toHaveBeenCalledWith({
      id: '1',
      content: 'test anecdote 1',
      votes: 4,
    })
  })

  test('voting does not touch the other anecdotes', async () => {
    useAnecdoteStore.setState({ anecdotes: initialAnecdotes })

    await useAnecdoteStore.getState().vote('1')

    const others = useAnecdoteStore.getState().anecdotes.filter(a => a.id !== '1')
    expect(others.map(a => a.votes)).toEqual([1, 7])
  })

  test('a new anecdote is added to the state', async () => {
    useAnecdoteStore.setState({ anecdotes: initialAnecdotes })

    await useAnecdoteStore.getState().addAnecdote('a brand new anecdote')

    const anecdotes = useAnecdoteStore.getState().anecdotes
    expect(anecdotes).toHaveLength(4)
    expect(anecdotes.map(a => a.content)).toContain('a brand new anecdote')
    expect(anecdoteService.create).toHaveBeenCalledWith('a brand new anecdote')
  })

  test('an anecdote can be removed from the state', async () => {
    useAnecdoteStore.setState({ anecdotes: initialAnecdotes })

    await useAnecdoteStore.getState().removeAnecdote('2')

    const anecdotes = useAnecdoteStore.getState().anecdotes
    expect(anecdotes.map(a => a.id)).toEqual(['1', '3'])
    expect(anecdoteService.remove).toHaveBeenCalledWith('2')
  })

  test('the filter can be changed', () => {
    useAnecdoteStore.getState().setFilter('test')

    expect(useAnecdoteStore.getState().filter).toBe('test')
  })
})
