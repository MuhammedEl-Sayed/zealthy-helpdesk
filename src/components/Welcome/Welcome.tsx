import { useState } from 'react';
import classes from './Welcome.module.css';
import { Navbar } from '../UI/Navbar/Navbar';

import TicketTable from '../UI/TicketTable/TicketTable';
import { Status } from '@/consts/Status';

export function Welcome() {
  const [filter, setFilter] = useState<Status | null>(null);
  return (
    <div className={classes.body}>
      <Navbar filter={filter} setFilter={setFilter} />
      <div
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <TicketTable filter={filter} />
      </div>
    </div>
  );
}
