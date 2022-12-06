import React from "react"

function StartScreen(props){
    return (
        <div className='start-page'>
            <p className='xo'>x<span>o</span></p>
            <div className="xo-wrapper">
                <p className='player-mark'>PICK PLAYER 1 MARK</p>
                <div className="button-container">
                    <div className={props.playAs === 'x' ? "selected-mark" : "x"} onClick={props.chooseMarkx}>x</div>
                    <div className={props.playAs === 'o' ? "selected-mark" : "x"} onClick={props.chooseMarko}>o</div>
                </div>
                <p className="tip">REMEMBER X: GOES FIRST</p>
            </div>
            <button className='new-game' onClick={props.startVsCpu}>NEW GAME VS CPU</button>
            <button className='new-game-p2p' onClick={props.startVsPlayer}>NEW GAME VS PLAYER</button>
        </div>
    )
}

export default StartScreen