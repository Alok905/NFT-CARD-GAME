import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import './index.css'
import { CreateBattle, Home, JoinBattle } from './page'
import { GlobalContextProvider } from './context'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalContextProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/create-battle' element={<CreateBattle />} />
          <Route path='/join-battle' element={<JoinBattle />} />
        </Routes>
      </GlobalContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
