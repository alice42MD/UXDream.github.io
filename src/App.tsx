import Volume from "./components/Volume"

const App = () => {
  return (
    <>
      <h1>UI dream</h1>
      <div>
        <>
          <div>Random</div>
          <Volume ui="randomize" />
        </>
        <>
          <div>Click click click</div>
          <Volume ui="clickToDeath" />
        </>
      </div>
    </>
  )
}

export default App
