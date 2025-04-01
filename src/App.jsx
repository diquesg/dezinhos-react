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
          <span className="tenzies-logo">🎲</span>
          <h1>Tenzies</h1>
          <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        </div>
        <div className="dice-wrapper">
          {diceElements}
        </div>
        <button onClick={gameWon ? () => setDice(generateAllNewDice) : rollDice} className="roll-button" ref={gameWonRef}>
          {!gameWon ?
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg> :
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>
          }
          {gameWon ? "New Game" : "Roll"}
        </button>
      </div>
    </main>
  )
}

export default App
