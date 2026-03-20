import { render, screen } from '@testing-library/react'
import { AuthForm } from '../features/auth/components/AuthForm'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}))

describe('AuthForm', () => {
  it('renders login and signup buttons', () => {
    render(<AuthForm />)
    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByText('Sign Up')).toBeInTheDocument()
  })
})
