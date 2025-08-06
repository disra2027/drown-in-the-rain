/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../useAuth'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

describe('useAuth', () => {
  const mockPush = jest.fn()
  
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    })
    localStorage.clear()
    mockPush.mockClear()
  })

  it('should return no user when not authenticated', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.loading).toBe(false)
  })

  it('should return user when authenticated', () => {
    const mockUser = {
      id: '1',
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'user'
    }

    localStorage.setItem('authToken', 'mock-token')
    localStorage.setItem('user', JSON.stringify(mockUser))

    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.loading).toBe(false)
  })

  it('should handle logout correctly', () => {
    const mockUser = {
      id: '1',
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'user'
    }

    localStorage.setItem('authToken', 'mock-token')
    localStorage.setItem('user', JSON.stringify(mockUser))

    const { result } = renderHook(() => useAuth())

    expect(result.current.isAuthenticated).toBe(true)

    act(() => {
      result.current.logout()
    })

    expect(localStorage.getItem('authToken')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('should handle corrupted localStorage data', () => {
    localStorage.setItem('authToken', 'mock-token')
    localStorage.setItem('user', 'invalid-json')

    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.loading).toBe(false)
  })
})