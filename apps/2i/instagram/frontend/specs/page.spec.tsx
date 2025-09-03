import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Page from '@/app/page'

describe('Page Component', () => {
  it('renders Hello World text', () => {
    render(<Page />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})