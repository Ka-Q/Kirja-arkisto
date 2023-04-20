import { render, screen } from '@testing-library/react';
import { Etusivu } from '../etusivu';

describe('Etusivu component', () => {
  test('renders navbar', () => {
    render(<Etusivu />);
    const navbarElement = screen.getByRole('navigation');
    expect(navbarElement).toBeInTheDocument();
  });

  test('renders front page by default', () => {
    render(<Etusivu />);
    const frontPageElement = screen.getByText(/Tervetuloa käyttämään kirja-arkistoa/i);
    expect(frontPageElement).toBeInTheDocument();
  });

  test('renders book page when navigating to /kirja', () => {
    window.history.pushState({}, 'Test page', '/kirja');
    render(<Etusivu />);
    const bookPageElement = screen.getByText(/Kirjat/i);
    expect(bookPageElement).toBeInTheDocument();
  });

  test('renders series page when navigating to /sarjasivu', () => {
    window.history.pushState({}, 'Test page', '/sarjasivu');
    render(<Etusivu />);
    const seriesPageElement = screen.getByText(/Sarjat/i);
    expect(seriesPageElement).toBeInTheDocument();
  });

  // Add more tests for other routes and components as needed
});
