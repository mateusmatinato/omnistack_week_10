import React, { useState, useEffect } from 'react';

import './global.css'
import './App.css'
import './sidebar.css'
import './main.css'

import api from './services/api'

import DevItem from './components/DevItem'
import DevForm from './components/DevForm';

function App() {

  const [devs, setDevs] = useState([])  

  useEffect( () => {
    async function loadDevs(){
      const response = await api.get('/devs')
      setDevs(response.data)
    }

    loadDevs()
  }, [])

  async function handleSubmit(data) {
    const response = await api.post('/devs', data)
    setDevs([
      ...devs,
      response.data
    ])
  }

  return (
    <div id="App">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleSubmit}/>
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <DevItem key={dev._id} dev={dev}/>
          ) )}
        </ul>
      </main>
    </div>
  );
}

export default App;
