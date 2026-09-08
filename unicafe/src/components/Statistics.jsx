import useCounterStore from '../store'

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = () => {
  const good = useCounterStore((state) => state.good)
  const neutral = useCounterStore((state) => state.neutral)
  const bad = useCounterStore((state) => state.bad)

  const all = good + neutral + bad
  // Ilman palautetta keskiarvo ja positiivisten osuus olisivat nollalla jakoja
  const average = all === 0 ? 0 : (good - bad) / all
  const positive = all === 0 ? 0 : (good / all) * 100

  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={`${positive} %`} />
        </tbody>
      </table>
    </div>
  )
}

export default Statistics
