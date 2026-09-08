import { test, expect, describe, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import AnecdoteList from '../components/AnecdoteList'
import useAnecdoteStore from '../store'

const testAnecdotes = [
  { id: '1', content: 'first anecdote', votes: 5 },
  { id: '2', content: 'second anecdote', votes: 10 },
  { id: '3', content: 'third anecdote', votes: 1 },
]

describe('<AnecdoteList />', () => {
  beforeEach(() => {
    useAnecdoteStore.setState({
      anecdotes: testAnecdotes,
      filter: '',
    })
  })

  test('6.13: renders anecdotes sorted by votes descending', () => {
    render(<AnecdoteList />)

    // Etsitään kaikki anekdoottitekstit DOM:sta ja tarkistetaan järjestys
    const rendered = screen.getAllByText(/anecdote$/)

    expect(rendered).toHaveLength(3)
    expect(rendered[0]).toHaveTextContent('second anecdote') // 10 votes
    expect(rendered[1]).toHaveTextContent('first anecdote')  // 5 votes
    expect(rendered[2]).toHaveTextContent('third anecdote')  // 1 vote
  })

  test('6.14: shows only anecdotes matching the filter', () => {
    useAnecdoteStore.setState({
      anecdotes: testAnecdotes,
      filter: 'fir', // täsmää vain "first anecdote"
    })

    render(<AnecdoteList />)

    expect(screen.getByText('first anecdote')).toBeInTheDocument()
    expect(screen.queryByText('second anecdote')).not.toBeInTheDocument()
    expect(screen.queryByText('third anecdote')).not.toBeInTheDocument()
  })

  test('an anecdote with votes cannot be deleted', () => {
    useAnecdoteStore.setState({
      anecdotes: [
        { id: '1', content: 'votes already given', votes: 2 },
        { id: '2', content: 'no votes yet', votes: 0 },
      ],
      filter: '',
    })

    render(<AnecdoteList />)

    // delete-nappi näkyy vain nolla ääntä saaneelle anekdootille
    expect(screen.getAllByRole('button', { name: 'vote' })).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: 'delete' })).toHaveLength(1)
  })
})
