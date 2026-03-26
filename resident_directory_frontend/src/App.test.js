import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Resident Directory app', () => {
  render(<App />);
  // The navbar title should be present
  const titleElement = screen.getByText(/Resident Directory/i);
  expect(titleElement).toBeInTheDocument();
});
