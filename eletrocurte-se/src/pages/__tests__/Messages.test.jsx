import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Messages from '../../components/ProfileEdition/Messages';

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('userId', 'test-user');

  // Mock da API fetch
  global.fetch = jest.fn((url, options) => {
    if (options && options.method === 'POST') {
      return Promise.resolve({ ok: true });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ messages: [] }),
    });
  });

  // Mock do Audio
  global.Audio = class {
    play() {
      return Promise.resolve();
    }
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders messages component', async () => {
  render(<Messages />);

  expect(await screen.findByText(/No messages yet/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/New message/i)).toBeInTheDocument();
  expect(screen.getByText(/Send/i)).toBeInTheDocument();
  expect(screen.getByText(/Back to Profile/i)).toBeInTheDocument();
});

test('sends a message successfully', async () => {
  render(<Messages />);

  const input = screen.getByLabelText(/New message/i);
  const sendButton = screen.getByText(/Send/i);

  fireEvent.change(input, { target: { value: 'Hello' } });
  fireEvent.click(sendButton);

  await waitFor(() =>
    expect(screen.getByText(/Message sent/i)).toBeInTheDocument()
  );

  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining('/api/messages'),
    expect.objectContaining({
      method: 'POST',
    })
  );
});

test('back to profile button redirects correctly', () => {
  delete window.location;
  window.location = { assign: jest.fn() };

  render(<Messages />);

  const backButton = screen.getByText(/Back to Profile/i);
  fireEvent.click(backButton);

  expect(window.location.assign).toHaveBeenCalledWith('/profile');
});