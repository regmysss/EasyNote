import Routes from "./components/Routes"
import NoteProvider from "./contexts/NoteContext"

function App() {
  return (
    <NoteProvider>
      <div
        className="w-[800px] m-auto"
      >
        <Routes />
      </div>
    </NoteProvider>
  )
}

export default App
