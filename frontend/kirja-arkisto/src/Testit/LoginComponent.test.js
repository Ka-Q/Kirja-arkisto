import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginComponent } from '../etusivu';

describe('LoginComponent', () => {
  it('renders the LoginComponent and logs in with admin credentials', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 'OK' }));

    render(<LoginComponent setIsLoggedIn={() => {}} />);

    // Find input fields and button
    const tunnusInput = screen.getByPlaceholderText('tunnus');
    const salasanaInput = screen.getByPlaceholderText('salasana');
    const loginButton = screen.getByRole('button', { name: 'Kirjaudu' });

    // Enter credentials and click the login button
    userEvent.type(tunnusInput, 'admin');
    userEvent.type(salasanaInput, 'admin');
    userEvent.click(loginButton);

    // Wait for the fetch response to be processed
    await screen.findByText('Kirjaudu ulos');

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
