import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import LoginPage from '../page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

// Mock fetch
global.fetch = jest.fn()

describe('LoginPage', () => {
  const mockPush = jest.fn()
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    })
    mockFetch.mockClear()
    mockPush.mockClear()
    localStorage.clear()
  })

  it('renders login form with all elements', () => {
    render(<LoginPage />)

    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.getByText('Sign in to your account to continue your journey')).toBeInTheDocument()
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
    expect(screen.getByText('Remember me')).toBeInTheDocument()
    expect(screen.getByText('Forgot password?')).toBeInTheDocument()
    expect(screen.getByText('Demo: demo@example.com / password123')).toBeInTheDocument()
  })

  it('validates email field', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)

    const submitButton = screen.getByRole('button', { name: 'Sign In' })
    
    // Submit with empty email
    await user.click(submitButton)
    expect(await screen.findByText('Email is required')).toBeInTheDocument()
  })


  it('validates password field', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)

    const submitButton = screen.getByRole('button', { name: 'Sign In' })
    const emailInput = screen.getByLabelText('Email')
    
    // Add valid email
    await user.type(emailInput, 'test@example.com')
    
    // Submit with empty password
    await user.click(submitButton)
    expect(await screen.findByText('Password is required')).toBeInTheDocument()

    // Submit with short password
    const passwordInput = screen.getByLabelText('Password')
    await user.type(passwordInput, '12345')
    await user.click(submitButton)
    expect(await screen.findByText('Password must be at least 6 characters')).toBeInTheDocument()
  })

  it('handles successful login', async () => {
    const user = userEvent.setup()
    const mockToken = 'mock-jwt-token-1'
    const mockUser = {
      id: '1',
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'user'
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        token: mockToken,
        user: mockUser
      })
    } as Response)

    render(<LoginPage />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign In' })

    await user.type(emailInput, 'demo@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'demo@example.com',
          password: 'password123'
        })
      })
    })

    await waitFor(() => {
      expect(localStorage.getItem('authToken')).toBe(mockToken)
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser))
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })

  it('handles login failure with invalid credentials', async () => {
    const user = userEvent.setup()

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: 'Invalid email or password'
      })
    } as Response)

    render(<LoginPage />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign In' })

    await user.type(emailInput, 'wrong@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
    })

    expect(localStorage.getItem('authToken')).toBeNull()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('handles network error', async () => {
    const user = userEvent.setup()

    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    render(<LoginPage />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign In' })

    await user.type(emailInput, 'demo@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument()
    })

    expect(localStorage.getItem('authToken')).toBeNull()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('disables submit button during loading', async () => {
    const user = userEvent.setup()

    // Mock a slow response
    mockFetch.mockImplementationOnce(() => 
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: async () => ({
              success: true,
              token: 'token',
              user: { id: '1', email: 'demo@example.com', name: 'Demo', role: 'user' }
            })
          } as Response)
        }, 100)
      })
    )

    render(<LoginPage />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign In' })

    await user.type(emailInput, 'demo@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    // Button should be disabled during loading
    expect(submitButton).toBeDisabled()
    expect(screen.getByText('Signing in...')).toBeInTheDocument()
  })
})