import { useState } from 'react'
import {BrowserRouter} from 'react-router-dom'
import './App.css'

import  Chatbot  from './components/ChatBot/ChatBot.jsx'
import Dropdown from "./components/Dropdownn.jsx";

function App() {
  const [count, setCount] = useState(0)

return (<>
  {/*<Dropdown/>*/}
  <Chatbot/>
</>)
}

export default App
