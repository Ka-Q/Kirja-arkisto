import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { KirjaSivu } from '../kirja/kirjasivu';

describe('KirjaSivu', () => {
  test('renders without crashing', () => {
    render(<KirjaSivu />);
    const header = screen.getByText('Kirjat');
    expect(header).toBeInTheDocument();
  });

  test('toggles Add Book form', () => {
    render(<KirjaSivu />);
    const addButton = screen.getByText('Lisää kirja');
    fireEvent.click(addButton);

    const backButton = screen.getByText('Palaa kirjojen hakuun');
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);
    expect(addButton).toBeInTheDocument();
  });

  test('toggles view mode', () => {
    render(<KirjaSivu />);
    const viewModeButtons = screen.getAllByText('🔳');
    const viewModeButton = viewModeButtons[0]; // Select the first button with the '🔳' text
    fireEvent.click(viewModeButton);
  
    const listViewModeButton = screen.getByText('📃');
    expect(listViewModeButton).toBeInTheDocument();
  
    fireEvent.click(listViewModeButton);
    expect(viewModeButton).toBeInTheDocument();
 
  
  });
});
