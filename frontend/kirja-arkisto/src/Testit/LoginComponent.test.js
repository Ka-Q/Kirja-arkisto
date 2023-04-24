import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginComponent } from '../etusivu';
import fetchMock from 'jest-fetch-mock';

beforeAll(() => {
  fetchMock.enableMocks();
});

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('LoginComponent', () => {
  it('renders the LoginComponent and logs in with admin credentials', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ status: 'OK' }));

    const mockSetIsLoggedIn = jest.fn();

    render(<LoginComponent setIsLoggedIn={mockSetIsLoggedIn} />);

    // Find input fields and button
    const tunnusInput = screen.getByPlaceholderText('tunnus');
    const salasanaInput = screen.getByPlaceholderText('salasana');
    const loginButton = screen.getByRole('button', { name: 'Kirjaudu' });

    // Enter credentials and click the login button
    userEvent.type(tunnusInput, 'admin');
    userEvent.type(salasanaInput, 'admin');
    userEvent.click(loginButton);

    // Wait for the setIsLoggedIn to be called
    await waitFor(() => expect(mockSetIsLoggedIn).toHaveBeenCalled());

    // Check if the fetch was called with the correct arguments
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/login', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sposti: 'admin', salasana: 'admin' }),
    });
  });
});