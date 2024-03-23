import { Text, rem } from '@mantine/core';
import { IconClockFilled, IconList, IconStarFilled, IconThumbUpFilled } from '@tabler/icons-react';
import { Dispatch, SetStateAction } from 'react';
import { IconButtonWithNumber } from '@/components/UI/IconButton/IconButtonWithNumber';
import { Status } from '@/consts/Status';
import { useTickets } from '@/contexts/MessagesContext';
import { theme } from '@/theme';
import classes from './Navbar.module.css';

interface NavbarProps {
  filter: Status | null;
  setFilter: Dispatch<SetStateAction<Status | null>>;
}

export const Navbar = ({ filter, setFilter }: NavbarProps) => {
  const { getTicketsByStatus, tickets } = useTickets();
  const handleClick = (status: Status | null) => {
    setFilter(status);
  };

  const isSelected = (status: Status | null) => filter === status;

  const iconStyle = (status: Status | null) => ({
    width: rem(20),
    height: rem(20),
    color: isSelected(status) ? theme.colors?.green?.[8] : theme.colors?.blue?.[8],
  });

  return (
    <nav className={classes.navbar}>
      <Text className={classes.title} fw={600} size="lg" c={theme.colors?.blue?.[8]}>
        Tickets
      </Text>
      <IconButtonWithNumber
        number={tickets.length}
        leftIcon={<IconList style={iconStyle(null)} stroke={1.5} />}
        text="All"
        onClick={() => handleClick(null)}
        selected={isSelected(null)}
      />
      <IconButtonWithNumber
        number={getTicketsByStatus(Status.New).length}
        leftIcon={<IconStarFilled style={iconStyle(Status.New)} stroke={1.5} />}
        text="New"
        onClick={() => handleClick(Status.New)}
        selected={isSelected(Status.New)}
      />
      <IconButtonWithNumber
        number={getTicketsByStatus(Status.InProgress).length}
        leftIcon={<IconClockFilled style={iconStyle(Status.InProgress)} stroke={1.5} />}
        text="In Progress"
        onClick={() => handleClick(Status.InProgress)}
        selected={isSelected(Status.InProgress)}
      />
      <IconButtonWithNumber
        number={getTicketsByStatus(Status.Resolved).length}
        leftIcon={<IconThumbUpFilled style={iconStyle(Status.Resolved)} stroke={1.5} />}
        text="Resolved"
        onClick={() => handleClick(Status.Resolved)}
        selected={isSelected(Status.Resolved)}
      />
    </nav>
  );
};
