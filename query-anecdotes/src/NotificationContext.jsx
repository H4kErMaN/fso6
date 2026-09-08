import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from 'react'

const NotificationContext = createContext(null)

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

// Luo notifikaation ja tyhjentää sen automaattisesti tietyn ajan kuluttua
export const useNotify = () => {
  const context = useContext(NotificationContext)
  const timerRef = useRef(null)

  if (!context) {
    throw new Error('useNotify must be used within a NotificationContextProvider')
  }

  const dispatch = context[1]

  return useCallback((message, duration = 5000) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    dispatch({ type: 'SET', payload: message })
    timerRef.current = setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, duration)
  }, [dispatch])
}

// Lue nykyinen notifikaatio (Notification-komponenttia varten)
export const useNotification = () => {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error('useNotification must be used within a NotificationContextProvider')
  }

  return context[0]
}

export default NotificationContext
