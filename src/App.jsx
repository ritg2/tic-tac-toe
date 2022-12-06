import { useEffect, useState } from 'react'
import Ticktac from './components/Ticktac.jsx'
import GameOver from './components/GameOver.jsx'
import StartScreen from './components/StartScreen.jsx'
import Restart from './components/Restart.jsx'
import { nanoid } from 'nanoid'

function App() {
  
  const [gameData, setGameData] = useState(data())
  const [gameOver, setGameOver] = useState(false)
  const [restart, setRestart] = useState (false)
  const [player, setPlayer] = useState('')
  const [playAs, setPlayAs] = useState('o')
  const [startGame, setStartGame] = useState(false)
  const [score, setScore] = useState({
    wino: 0,
    draw: 0,
    winx: 0
  })
  const [singlePlayer, setSinglePlayer] = useState('')

  function data(){
    const array = [{turn:true, data:[]}]
    for (let i = 0; i < 9; i++){
        array[0].data.push( {
                    id: i + 1,
                    value: '',
                    clicked: false,
                    winPosition : false
                })
    }
    return array
  }

  function origboard() {
    return gameData[0].data.map((item,index) => item.value === 'x' || item.value === 'o' ? item.value : index)
  }

  function emptySquares(board){
    return  board.filter(item => item !== 'x' && item !== 'o')
  }

  const origBoard = origboard()
  const huPlayer = playAs
  const aiPlayer = playAs === 'o' ? 'x' : 'o'

  function minimax(newBoard, player) {

    let availSpots = emptySquares(newBoard)
  
    if (checkWin(newBoard, huPlayer)) {
      return {score: -10}
    } else if (checkWin(newBoard, aiPlayer)) {
      return {score: 10}
    } else if (availSpots.length === 0) {
      return {score: 0}
    }
    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
      let move = {}
      move.index = newBoard[availSpots[i]]
      newBoard[availSpots[i]] = player
  
      if (player == aiPlayer) {
        let result = minimax(newBoard, huPlayer)
        move.score = result.score
      } else {
        let result = minimax(newBoard, aiPlayer)
        move.score = result.score
      }
  
      newBoard[availSpots[i]] = move.index
  
      moves.push(move)
    }
  
    let bestMove
    if(player === aiPlayer) {
      let bestScore = -10000
      for(let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score
          bestMove = i
        }
      }
    } else {
      let bestScore = 10000
      for(let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score
          bestMove = i
        }
      }
    }
  
    return moves[bestMove];
  }

  function checkWin(board, player){
    if (
           (board[0] == player && board[1] == player && board[2] == player) ||
           (board[3] == player && board[4] == player && board[5] == player) ||
           (board[6] == player && board[7] == player && board[8] == player) ||
           (board[0] == player && board[3] == player && board[6] == player) ||
           (board[1] == player && board[4] == player && board[7] == player) ||
           (board[2] == player && board[5] == player && board[8] == player) ||
           (board[0] == player && board[4] == player && board[8] == player) ||
           (board[2] == player && board[4] == player && board[6] == player)
           ) {
           return true
       } else {
           return false
       }
   }

  function chooseBoxVsCpu(id){
    if(gameData[0].turn && !gameData[0].data[id - 1].value && !gameOver && playAs === 'x'){
      setGameData(prevData => [{turn:false, data:prevData[0].data.map(item => {
        return id === item.id && !item.value ? {...item, value: 'x', clicked: true} : item
      })}] )
    }else if(!gameData[0].turn && !gameData[0].data[id - 1].clicked && !gameOver && playAs === 'o'){
      setGameData(prevData => [{turn:true, data:prevData[0].data.map(item => {
        return id === item.id && !item.value ? {...item, value: 'o', clicked: true} : item
      })}] )
    }
  }

  function chooseBoxVsPlayer(id){
    if(gameData[0].turn && !gameData[0].data[id - 1].value && !gameOver){
      setGameData(prevData => [{turn:false, data:prevData[0].data.map(item => {
        return id === item.id && !item.value ? {...item, value: 'x', clicked: true} : item
      })}] )
    }else if(!gameData[0].turn && !gameData[0].data[id - 1].clicked && !gameOver){
      setGameData(prevData => [{turn:true, data:prevData[0].data.map(item => {
        return id === item.id && !item.value ? {...item, value: 'o', clicked: true} : item
      })}] )
    }
  }

  function cpu() {

    let bestSpot = minimax(origBoard, aiPlayer)

    if(!gameOver && !gameData[0].turn && singlePlayer && playAs === 'x'){
      setGameData(prevData => [{turn:true, data:prevData[0].data.map(item => {
        return item.id == bestSpot.index + 1 && !item.clicked ? {...item, value: 'o', clicked: true} : item
      })}] )
    }else if(!gameOver && gameData[0].turn && singlePlayer  && playAs === 'o'){
      setGameData(prevData => [{turn:false, data:prevData[0].data.map(item => {
        return item.id == bestSpot.index + 1  && !item.clicked ? {...item, value: 'x', clicked: true} : item
      })}] )
    }
  }

  function undo(){
    setStartGame(false)
    setRestart(false)
    setScore({
      wino: 0,
      draw: 0,
      winx: 0
  })
  }

  function moves() {
    const possibleWinMoves = [[0, 1, 2],
                              [3, 4, 5],
                              [6, 7, 8],
                              [0, 3, 6],
                              [1, 4, 7],
                              [2, 5, 8],
                              [0, 4, 8],
                              [2, 4, 6]]

    const gd =  gameData[0].data
    let psx =  possibleWinMoves.map(moves => moves.map(item => gd[item]))
    let pw = psx.map(ar1 => ar1.filter(ar2 => ar2.value === 'x'))
    let wd = pw.filter(ar1 => ar1.length >= 3)
    let fnly = wd.flat(1)
    let psx2 =  possibleWinMoves.map(moves => moves.map(item => gd[item]))
    let pw2 = psx2.map(ar1 => ar1.filter(ar2 => ar2.value === 'o'))
    let wd2 = pw2.filter(ar1 => ar1.length >= 3)
    let fnly2 = wd2.flat(1)

    const xWon = possibleWinMoves.map(moves => moves.map(item => gameData[0].data[item].value).every(item => item === 'x'))

    const oWon = possibleWinMoves.map(moves => moves.map(item => gameData[0].data[item].value).every(item => item === 'o'))
    if(gameOver && xWon.includes(true)){
      setGameData(prevData => [{...prevData[0], data: prevData[0].data.map(item => {
        return item.id === fnly[0].id || item.id === fnly[1].id || item.id === fnly[2].id && xWon.includes(true) ? {...item, winPosition: true} : item
      })}])
      setScore(oldScore => ({...oldScore, winx: oldScore.winx+1}))
    }else if (gameOver && oWon.includes(true)){
      setGameData(prevData => [{...prevData[0], data: prevData[0].data.map(item => {
        return item.id === fnly2[0].id || item.id === fnly2[1].id || item.id === fnly2[2].id && oWon.includes(true) ? {...item, winPosition: true} : item
      })}])
      setScore(oldScore => ({...oldScore, wino: oldScore.wino + 1}))
    }
  }

  function isGameOver() {
    if([0, 1, 2].map(item => gameData[0].data[item].value).every(item => item === 'x') ||
      [3, 4, 5].map(item => gameData[0].data[item].value).every(item => item === 'x') ||
      [6, 7, 8].map(item => gameData[0].data[item].value).every(item => item === 'x') ||
      [0, 3, 6].map(item => gameData[0].data[item].value).every(item => item === 'x') ||
      [1, 4, 7].map(item => gameData[0].data[item].value).every(item => item === 'x') ||
      [2, 5, 8].map(item => gameData[0].data[item].value).every(item => item === 'x') ||
      [0, 4, 8].map(item => gameData[0].data[item].value).every(item => item === 'x') ||
      [2, 4, 6].map(item => gameData[0].data[item].value).every(item => item === 'x')){
      setGameOver(true)
      setPlayer('x TAKES THE ROUND')
    }else if([0, 1, 2].map(item => gameData[0].data[item].value).every(item => item === 'o') ||
      [3, 4, 5].map(item => gameData[0].data[item].value).every(item => item === 'o') ||
      [6, 7, 8].map(item => gameData[0].data[item].value).every(item => item === 'o') ||
      [0, 3, 6].map(item => gameData[0].data[item].value).every(item => item === 'o') ||
      [1, 4, 7].map(item => gameData[0].data[item].value).every(item => item === 'o') ||
      [2, 5, 8].map(item => gameData[0].data[item].value).every(item => item === 'o') ||
      [0, 4, 8].map(item => gameData[0].data[item].value).every(item => item === 'o') ||
      [2, 4, 6].map(item => gameData[0].data[item].value).every(item => item === 'o')){
      setGameOver(true)
      setPlayer('o TAKES THE ROUND')
    }else if (gameData[0].data.every(item => item.clicked === true)){
      setGameOver(true)
      setPlayer("IT'S A DRAW")
      setScore(oldScore => ({...oldScore, draw: oldScore.draw + 1}))
    }else{
      setTimeout(() => cpu(), 500)
    }
    
  }

  function chooseMarkx(){
    setPlayAs('x')
  }

  function chooseMarko(){
    setPlayAs('o')
  }

  function startVsCpu(){
    setStartGame(true)
    setSinglePlayer(true)
    playAgain()
  }

  function startVsPlayer(){
    setStartGame(true)
    setSinglePlayer(false)
    playAgain()
  }

  useEffect(() => {
    isGameOver()
    return 
  }, [gameData])

  useEffect(() => {
    moves()
    return 
  }, [gameOver])

  function playAgain(){
    setGameData(data())
    setGameOver(false)
    setPlayer("")
  }

  function  restartState() {
    setRestart(true)
  }

  function cancel(){
    setRestart(false)
  }

  const ticktac = gameData[0].data.map(item => {
    return <Ticktac key={nanoid()} {...item} chooseBoxVsCpu={chooseBoxVsCpu} chooseBoxVsPlayer={chooseBoxVsPlayer} singlePlayer={singlePlayer}/>
  })
  return (
    <div>
      {!startGame && <StartScreen startVsCpu={startVsCpu} startVsPlayer={startVsPlayer} chooseMarko={chooseMarko} chooseMarkx={chooseMarkx} playAs={playAs}/>}
      {startGame && gameOver && <GameOver playAgain={playAgain} player={player} quit={undo} singlePlayer={singlePlayer} playAs={playAs}/>}
      {restart && <Restart undo={undo} cancel={cancel}/>}
      {startGame && <div className='container'>
        <div className='xo'>x<span>o</span></div>
        <div className='turn'>{gameData[0].turn ? 'X' : 'O'} TURN</div>
        <button onClick={restartState} className="undo"><i className="fa-solid fa-rotate-right"></i></button>
        {ticktac}
        <div className='scorex'>X ({playAs === 'x' && singlePlayer ? 'YOU' : singlePlayer ? 'CPU' : "player1"}) <div>{score.winx}</div></div>
        <div className='score'>TIES <div>{score.draw}</div></div>
        <div className='scoreo'>O ({playAs === 'o' && singlePlayer ? 'YOU' : singlePlayer ? 'CPU' : 'player2'}) <div>{score.wino}</div></div>
      </div>}
    </div>
  )
}

export default App