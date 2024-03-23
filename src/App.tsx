import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { theme } from './theme';
import { TicketProvider } from './contexts/MessagesContext';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <TicketProvider>
        <Router />
      </TicketProvider>
    </MantineProvider>
  );
}
