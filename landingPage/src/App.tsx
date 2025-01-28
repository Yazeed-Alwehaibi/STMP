import './App.css'

function App() {

  return (
    <>
      <h1>Summer Training Platform</h1>
      <div className='uname'>
      <label htmlFor="inputField">User name:</label>
      <input type="text" id="inputField" name="inputField" placeholder="User name"></input>
      </div>
      <div className='upass'>
      <label htmlFor="inputField">Password:</label>
      <input type="text" id="inputField" name="inputField" placeholder="password"></input>
      </div>
      <div className="card">
        <input type="text" id="Username" name="Username" placeholder="Username"></input>
        <br></br>
        <input type="password" id="password" name="password" placeholder="Password"></input>
        <br></br>
        <button>log in</button>
        <button >register</button>
      </div>
    </>
  )
}

export default App
