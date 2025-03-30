export default function Die(props) {
    return (
        <button className={props.isHeld ? "die-button-isheld" : "die-button"}>{props.value}</button>
    )
}