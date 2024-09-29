import Routes from "./components/Routes"
import AuthProvider from "./contexts/AuthContext"
import NoteProvider from "./contexts/NoteContext"

function App() {
  return (
    <AuthProvider>
      <NoteProvider>
        <div
          className="w-[800px] m-auto"
        >
          <Routes />
        </div>
      </NoteProvider>
    </AuthProvider>
  )
}

export default App
