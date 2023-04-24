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

  test('renders book page when navigating to /kirja', async () => {
    window.history.pushState({}, 'Test page', '/kirja');
    render(<Etusivu />);
    const bookPageElements = await screen.findAllByText(/Kirjat/i);
    // Assuming the second element in the array is the desired element
    expect(bookPageElements[1]).toBeInTheDocument();
  });
  
  test('renders series page when navigating to /sarjasivu', async () => {
    window.history.pushState({}, 'Test page', '/sarjasivu');
    render(<Etusivu />);
    const seriesPageElements = await screen.findAllByText(/Sarjat/i);
    // Assuming the second element in the array is the desired element
    expect(seriesPageElements[1]).toBeInTheDocument();
  });
  
  // Add more tests for other routes and components as needed
});
