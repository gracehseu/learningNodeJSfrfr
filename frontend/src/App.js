import './App.css';
import { useState, useEffect } from 'react'

const io = require('socket.io-client');
const socket = io('http://localhost:3000');

function randomElementFromList(arr) {
  const random = Math.floor(Math.random() * arr.length);
  console.log(random)
  return arr[random]
}

function generateRandomRoom() {
  const number = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
  const verbs = ["dancing", "prancing", "programming", "sleeping"]
  const animals = ["hedgehogs", "manatees", "kiwis", "shihtzus"]
  const roomName = randomElementFromList(number) + "-" + randomElementFromList(verbs) + "-" + randomElementFromList(animals)
  return roomName
}

export default function App() {

  useEffect(() => {
    // const handler = (message) => { messageHandler(message, participantsRef.current, setParticipants) };
    // socket.on('create', function(room) {
    //   socket.join(room);
    // });
    return () => {
      socket.off('message', handler);
    }
  }, []);

  const [inputValue, setInputValue] = useState('')

  const handleChange = (e) => {
    setInputValue(e.currentTarget.value)
  }
  const handleSubmit = event => {
    event.preventDefault();
    console.log(inputValue)
  } 
  const newGame = event =>  {
    const room = generateRandomRoom()
    socket.emit('connectedRoom', {'room': room})
    window.location.href = '/' + room
  }

  const joinGame = () => {
    alert('join game with code')
  }
  return (
    <div className="wrapper">
      <h1>Lobby</h1>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            <p>Name</p>
            <input name="name" onChange={handleChange}/>
          </label>
        </fieldset>
        {/* <button type="Join Game" onClick={joinGame}>Join Game</button> */}
        <button type="New Game" onClick={newGame}>New Game</button>
      </form>
    </div>
  );
}

