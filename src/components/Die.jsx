export default function Die(props) {
    return (
        <button
            className={`die-button ${props.isHeld ? 'die-button-isheld' : ''} ${props.gameWon ? 'winner-glow' : ''}`}
            onClick={props.hold}
            aria-pressed={props.isHeld}
            aria-label={`Die with value ${props.value}, ${props.isHeld ? "held" : "not held"}`}
        >
            {props.value}
        </button>
    )
}