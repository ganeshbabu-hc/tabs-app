
import React from 'react';
import './App.css';
import Tabs from "./components/Tabs"

function App () {
  return(
    <> 
      <h2 className="header">Tab container </h2>
      <div className="tab-container">
        <Tabs tabLimit={10} tabWidth={120}/>
      </div>
    </>
  )
}

export default App;
