import { useState } from 'react'
import { nanoid } from "nanoid"
import Die from './components/Die'

function App() {

  function generateAllNewDice() {
    const diceObjArray = []
    for (var i = 0; i < 10; i++) {
      diceObjArray.push({ value: Math.ceil(Math.random() * 6), isHeld: false, id: nanoid() })
    }
    return diceObjArray
  }

  const [dice, setDice] = useState(generateAllNewDice)

  const diceElements = dice.map((dieObj) => <Die value={dieObj.value} key={dieObj.id} isHeld={dieObj.isHeld} />)

  function rollDice() {
    setDice(generateAllNewDice)
  }

  return (
    < main >
      <div className='dice-content'>
        <div className="dice-wrapper">
          {diceElements}
        </div>
        <button onClick={rollDice} className="roll-button">Roll</button>
      </div>
    </main>
  )
}

export default App
