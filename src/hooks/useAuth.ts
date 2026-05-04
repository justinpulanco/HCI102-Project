import { useLocalStorage } from './useLocalStorage'

export interface User {
  id: string
  email: string
  name: string
  createdAt: number
}

interface StoredUser extends User {
  password: string
}

export function useAuth() {
  const [users, setUsers] = useLocalStorage<StoredUser[]>('sf-users', [])
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('sf-current-user', null)
  const [isGuest, setIsGuest] = useLocalStorage('sf-is-guest', false)

  const signup = (email: string, password: string, name: string): { success: boolean; error?: string } => {
    // Validate
    if (!email || !password || !name) {
      return { success: false, error: 'All fields are required' }
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: 'Invalid email format' }
    }

    // Check if user exists (case-insensitive)
    const normalizedEmail = email.toLowerCase().trim()
    if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
      return { success: false, error: 'Email already registered' }
    }

    // Create user
    const newUser: StoredUser = {
      id: Date.now().toString(),
      email: normalizedEmail,
      password, // In production, hash this!
      name,
      createdAt: Date.now(),
    }

    setUsers([...users, newUser])
    const { password: _, ...userWithoutPassword } = newUser
    setCurrentUser(userWithoutPassword)
    setIsGuest(false)

    return { success: true }
  }

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const normalizedEmail = email.toLowerCase().trim()
    const user = users.find(u => u.email.toLowerCase() === normalizedEmail && u.password === password)

    if (!user) {
      return { success: false, error: 'Invalid email or password' }
    }

    const { password: _, ...userWithoutPassword } = user
    setCurrentUser(userWithoutPassword)
    setIsGuest(false)

    return { success: true }
  }

  const loginAsGuest = () => {
    setCurrentUser(null)
    setIsGuest(true)
  }

  const logout = () => {
    setCurrentUser(null)
    setIsGuest(false)
  }

  const updateUserName = (newName: string): { success: boolean; error?: string } => {
    if (!newName || !newName.trim()) {
      return { success: false, error: 'Name cannot be empty' }
    }

    if (!currentUser) {
      return { success: false, error: 'No user logged in' }
    }

    const updatedUser = { ...currentUser, name: newName.trim() }
    setCurrentUser(updatedUser)

    // Also update in users list
    const updatedUsers = users.map(u => 
      u.id === currentUser.id ? { ...u, name: newName.trim() } : u
    )
    setUsers(updatedUsers)

    return { success: true }
  }

  return {
    currentUser,
    isGuest,
    isLoggedIn: !!currentUser || isGuest,
    signup,
    login,
    loginAsGuest,
    logout,
    updateUserName,
  }
}
