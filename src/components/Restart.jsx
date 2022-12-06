import React from "react"

function Restart(props){
    return(
        <div className='game-over'>
            <div className="game-over-options">
                <p className='restart-title'>RESTART GAME?</p>
                <button className='quit' onClick={props.undo}>YES, RESTART</button>
                <button className='next-round' onClick={props.cancel}>NO, CANCEL</button>
            </div>
        </div>
    )
}

export default Restart