import { useState, useRef, useEffect } from 'react'
import { nanoid } from "nanoid"
import Die from './components/Die'
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'

function App() {
  const { width, height } = useWindowSize()

  function generateRandomValue() {
    return Math.ceil(Math.random() * 6)
  }

  function generateAllNewDice() {
    const diceObjArray = []
    for (var i = 0; i < 10; i++) {
      diceObjArray.push({ value: generateRandomValue(), isHeld: false, id: nanoid() })
    }
    return diceObjArray
  }

  const [dice, setDice] = useState(() => generateAllNewDice())

  const diceElements = dice.map((dieObj) => <Die value={dieObj.value} key={dieObj.id} isHeld={dieObj.isHeld} hold={() => hold(dieObj.id)} />)

  function rollDice() {
    setDice(prevDice => prevDice.map(dieObj => dieObj.isHeld ? dieObj : { ...dieObj, value: generateRandomValue() }))
  }

  function hold(id) {
    setDice(prevDice => prevDice.map(
      dieObj =>
        dieObj.id === id ? { ...dieObj, isHeld: !dieObj.isHeld } : dieObj
    ))
  }

  const gameWon = dice.every(dieObj => dieObj.value === dice[0].value) && dice.every(dieObj => dieObj.isHeld === true)

  const gameWonRef = useRef(null)

  useEffect(() => {
    gameWon && gameWonRef.current.focus()
  }, [gameWon])

  return (
    < main >
      {gameWon && <Confetti width={width} height={height} />}
      <div aria-live='polite' className='sr-only'>
        {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
      </div>
      <div className='dice-content'>
        <div className="description">
          <h1>Tenzies</h1>
          <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        </div>
        <div className="dice-wrapper">
          {diceElements}
        </div>
        <button onClick={gameWon ? () => setDice(generateAllNewDice) : rollDice} className="roll-button" ref={gameWonRef}>{gameWon ? "New Game" : "Roll"}</button>
      </div>
    </main>
  )
}

export default App
