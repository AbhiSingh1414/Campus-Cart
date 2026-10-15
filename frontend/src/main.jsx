import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.jsx'
import { Provider } from 'react-redux'
import App from './App.jsx'
import { store } from './redux/store.js'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Provider>
)
