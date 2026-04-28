import { useState } from 'react'
import Home from './component/Home'
import Editorpage from './component/Editorpage'
import{Routes,Route} from "react-router-dom"
import {Toaster} from 'react-hot-toast'

function App() {

  return (
    <>
    <Toaster position="top-center"></Toaster>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/editor/:roomId" element={<Editorpage />}/>
    </Routes>
    </>
  )
}

export default App
