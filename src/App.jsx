import { useState, useRef, useEffect } from 'react'
import { nanoid } from "nanoid"
import Die from './components/Die'
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'
import { useStopwatch } from 'react-timer-hook';

function App() {
  const { width, height } = useWindowSize()

  const [counter, setCounter] = useState(0)

  const { seconds, minutes, start, pause, reset, isRunning } = useStopwatch({ autoStart: false, interval: 1 })

  function generateRandomValue() {
    return Math.ceil(Math.random() * 6)
  }

  function generateAllNewDice() {
    const diceObjArray = []
    setCounter(0)
    reset(undefined, false)
    for (var i = 0; i < 10; i++) {
      diceObjArray.push({ value: generateRandomValue(), isHeld: false, id: nanoid() })
    }
    return diceObjArray
  }

  const [dice, setDice] = useState(() => generateAllNewDice())

  const gameWon = dice.every(dieObj => dieObj.value === dice[0].value) && dice.every(dieObj => dieObj.isHeld === true)
  const diceElements = dice.map((dieObj) => <Die value={dieObj.value} gameWon={gameWon} key={dieObj.id} isHeld={dieObj.isHeld} hold={() => hold(dieObj.id)} />)

  function rollDice() {
    !isRunning && start()
    setCounter(prevCount => prevCount + 1)
    setDice(prevDice => prevDice.map(dieObj => dieObj.isHeld ? dieObj : { ...dieObj, value: generateRandomValue() }))
  }

  function hold(id) {
    !isRunning && start()
    setDice(prevDice => prevDice.map(
      dieObj =>
        dieObj.id === id ? { ...dieObj, isHeld: !dieObj.isHeld } : dieObj
    ))
  }


  const gameWonRef = useRef(null)

  useEffect(() => {
    gameWon && gameWonRef.current.focus()
  }, [gameWon])

  return (
    < main >
      {gameWon && <Confetti width={width} height={height} numberOfPieces={window.innerWidth < 768 ? 90 : 200} />}
      <div aria-live='polite' aria-atomic="true" className='sr-only'>
        {gameWon && <p>Parabéns! Você venceu! Clique em "Novo jogo" para recomeçar.</p>}
      </div>
      <div className='dice-content'>
        <div className="description">
          <span className="tenzies-logo">{!gameWon ? "🎲" : "🏆"}</span>
          <h1>{!gameWon ? "Dezinhos" : "Dezinhos!"}</h1>
          <p>{!gameWon ? "Role e clique nos dados com o mesmo número até todos os dados terem o mesmo valor." : `Parabéns! Você venceu! Clique em "Novo jogo" para recomeçar.`}</p>
        </div>
        <div className="stats">
          <span className="stopwatch">⏳ {`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`}</span>
          <span className="counter"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>{counter}</span>
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
          {gameWon ? "Novo jogo" : "Rolar"}
          {gameWon && pause()}
        </button>
      </div>
    </main>
  )
}

export default App
