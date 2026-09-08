import useCounterStore from '../store'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
)

const Buttons = () => {
  const addGood = useCounterStore((state) => state.addGood)
  const addNeutral = useCounterStore((state) => state.addNeutral)
  const addBad = useCounterStore((state) => state.addBad)

  return (
    <div>
      <h2>give feedback</h2>
      <Button handleClick={addGood} text="good" />
      <Button handleClick={addNeutral} text="neutral" />
      <Button handleClick={addBad} text="bad" />
    </div>
  )
}

export default Buttons
