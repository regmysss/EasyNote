import Routes from "./components/Routes"
import AuthProvider from "./contexts/AuthContext"
import NoteProvider from "./contexts/NoteContext"

function App() {
  return (
    <AuthProvider>
      <NoteProvider>
        <Routes />
      </NoteProvider>
    </AuthProvider>
  )
}

export default App
