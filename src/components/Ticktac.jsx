import React from "react"

function Ticktac(props){
    const chooseBox = props.singlePlayer ? props.chooseBoxVsCpu : props.chooseBoxVsPlayer
    const style2 =  props.winPosition && props.value === 'o' ? "boxedo" : "box"
    const style = props.winPosition && props.value === 'x' ? "boxed" : style2
    return (
        <div className={style} onClick={() => chooseBox(props.id)}>
            <span className={props.winPosition && props.value === 'o' ?  "marked-o" : props.value === 'o' ? 'mark-o' : null }>{props.value}</span>
        </div>
    )
}

export default Ticktac