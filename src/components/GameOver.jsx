import React from "react"

function GameOver(props){
    const winCondition = props.player === "x TAKES THE ROUND" ? "X WON!" : props.player === "IT'S A DRAW" ? "IT'S A DRAW" : "O WON!"
    const whoWon = props.player === "x TAKES THE ROUND" ? 'who-won' : props.player === "IT'S A DRAW" ? 'draw' : 'who-wono'
    return (
        <div className='game-over'>
            <div className="game-over-options">
                <p className='win-condition'>{winCondition}</p>
                <p className={whoWon}>{props.player}</p>
                <button className='quit' onClick={props.quit}>QUIT</button>
                <button className='next-round' onClick={props.playAgain}>NEXT ROUND</button>
            </div>
        </div>
    )
}

export default GameOver