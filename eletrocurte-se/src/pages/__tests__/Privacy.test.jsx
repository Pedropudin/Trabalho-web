import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Privacy from '../../components/ProfileEdition/Privacy';

describe('Privacy', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('userId', 'test-user');
    // Mock fetch for backend PATCH
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );
  });

  it('renders privacy settings and toggles switches', () => {
    render(<Privacy onVoltar={() => {}} />);
    expect(screen.getByText(/Privacy Settings/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Allow email notifications/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Share data with partners/i)).toBeInTheDocument();
  });

  it('saves preferences and shows snackbar', async () => {
    render(<Privacy onVoltar={() => {}} />);
    fireEvent.click(screen.getByText(/Save Preferences/i));
    await waitFor(() => {
      expect(screen.getByText(/Preferences saved successfully/i)).toBeInTheDocument();
    });
  });

  it('calls onVoltar when clicking confirm and return', () => {
    const onVoltar = jest.fn();
    render(<Privacy onVoltar={onVoltar} />);
    fireEvent.click(screen.getByText(/Confirm and return to Profile/i));
    expect(onVoltar).toHaveBeenCalled();
  });
});
