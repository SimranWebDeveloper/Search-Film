import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import StartRating from './StartRating'
import App_v1 from './App_v1'


ReactDOM.createRoot(document.getElementById('root')).render(
  <>

    {/* <StartRating maxRating={5} message={['Terrible','Bad','Okey','Good','Amazing']} defaultValue={5}/> */}
    {/* <StartRating color={'red'} size={23}/> */}
    {/* <App_v1/> */}
    <App />
  </>,
)
