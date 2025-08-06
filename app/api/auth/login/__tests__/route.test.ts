/**
 * @jest-environment node
 */
import { POST } from '../route'

describe('POST /api/auth/login', () => {
  it('returns 400 when email is missing', async () => {
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password: 'password123' }),
      headers: { 'Content-Type': 'application/json' }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toBe('Email and password are required')
  })

  it('returns 400 when password is missing', async () => {
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'demo@example.com' }),
      headers: { 'Content-Type': 'application/json' }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toBe('Email and password are required')
  })

  it('returns 401 for invalid credentials', async () => {
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'wrong@example.com',
        password: 'wrongpassword'
      }),
      headers: { 'Content-Type': 'application/json' }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.message).toBe('Invalid email or password')
  })

  it('returns success for valid demo credentials', async () => {
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'demo@example.com',
        password: 'password123'
      }),
      headers: { 'Content-Type': 'application/json' }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.token).toMatch(/^mock-jwt-token-1-\d+$/)
    expect(data.user).toEqual({
      id: '1',
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'user'
    })
  })

  it('returns success for valid admin credentials', async () => {
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      }),
      headers: { 'Content-Type': 'application/json' }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.token).toMatch(/^mock-jwt-token-2-\d+$/)
    expect(data.user).toEqual({
      id: '2',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin'
    })
  })

  it('handles JSON parsing errors', async () => {
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: 'invalid json',
      headers: { 'Content-Type': 'application/json' }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.message).toBe('Internal server error')
  })

  it('simulates API delay', async () => {
    const startTime = Date.now()
    
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'demo@example.com',
        password: 'password123'
      }),
      headers: { 'Content-Type': 'application/json' }
    })

    await POST(request)
    const endTime = Date.now()
    const duration = endTime - startTime

    // Should take at least 1000ms due to simulated delay
    expect(duration).toBeGreaterThanOrEqual(1000)
  })
})