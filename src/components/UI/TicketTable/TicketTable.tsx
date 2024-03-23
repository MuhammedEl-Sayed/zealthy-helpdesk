import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';
import { useEffect, useMemo, useState } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  MRT_EditActionButtons,
  MRT_TableOptions,
} from 'mantine-react-table';
import { Button, Flex, Menu, ScrollArea, Stack, Title, Modal, Textarea } from '@mantine/core';
import { IconUserCircle, IconSend, IconExchange } from '@tabler/icons-react';
import { debounce } from 'lodash';
import { Status } from '@/consts/Status';
import { convertToRgba } from '@/utils/convertToRgba';
import { theme } from '@/theme';

import { StatusBadge } from '../StatusBadge/StatusBadge';
import { Ticket } from '@/types/ticket';
import { useTickets } from '@/contexts/MessagesContext';
import { convertStatusEnum } from '@/utils/convertStatusEnum';

interface TicketTableProps {
  filter: Status | null;
}

const TicketTable = ({ filter }: TicketTableProps) => {
  const { tickets, updateTicket, respondToTicket, getTicketsByStatus } = useTickets();

  const [filteredData, setFilteredData] = useState(tickets);
  useEffect(() => {
    if (filter === null) setFilteredData(tickets);
    else setFilteredData(getTicketsByStatus(filter));
  }, [filter, tickets]);

  const handleSaveUser: MRT_TableOptions<Ticket>['onEditingRowSave'] = async ({
    values,

    table,
  }) => {
    await updateTicket(values.id, values);

    table.setEditingRow(null);
  };
  const debouncedChangeHandler = useMemo(() => debounce((value) => setResponse(value), 300), []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [response, setResponse] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);

  const handleSendResponseClick = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };
  const handleSubmitResponse = () => {
    if (selectedRow) {
      respondToTicket(selectedRow.original.id ?? '', response);
      console.log(response);
      setIsModalOpen(false);
    }
  };

  const columns = useMemo<MRT_ColumnDef<Ticket>[]>(
    () => [
      {
        id: 'ticket',
        header: 'Ticket Info',
        columns: [
          {
            accessorKey: 'id',
            header: 'ID',
            size: 100,
            enableEditing: false,
          },
          {
            accessorKey: 'title',
            header: 'Title',
            size: 200,
            enableEditing: false,
          },
          {
            accessorKey: 'from',
            header: 'From',
            size: 200,
            enableEditing: false,
          },
          {
            accessorKey: 'status',
            header: 'Status',
            size: 200,
            Cell: ({ cell }) => (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <StatusBadge status={cell.getValue<Status>()} />
              </div>
            ),
            editVariant: 'select',
            mantineEditSelectProps: {
              data: Object.values(Status).map((status) => ({
                value: status,
                label: convertStatusEnum(status),
              })),
            },
          },
          {
            accessorKey: 'createdAt',
            header: 'Created At',
            size: 200,
            Cell: ({ cell }) => new Date(cell.getValue<number>()).toLocaleString(),
            enableEditing: false,
          },
          {
            accessorKey: 'updatedAt',
            header: 'Updated At',
            size: 200,
            Cell: ({ cell }) => new Date(cell.getValue<number>()).toLocaleString(),
            enableEditing: false,
          },
          {
            accessorKey: 'description',
            header: 'Description',
            size: 300,
            enableEditing: false,
          },
        ],
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: filteredData,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableFacetedValues: true,
    enableColumnDragging: false,
    enableGrouping: true,
    enableColumnPinning: true,
    enableRowActions: true,
    enableRowSelection: false,
    initialState: {
      showGlobalFilter: true,
      columnPinning: {
        left: ['mrt-row-expand', 'mrt-row-select'],
        right: ['mrt-row-actions'],
      },
      columnVisibility: {
        id: false,
        response: false,
        description: false,
      },
    },
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    mantinePaginationProps: {
      radius: 'xl',
      size: 'lg',
    },
    mantineSearchTextInputProps: {
      placeholder: 'Search Tickets',
    },
    renderRowActionMenuItems: ({ row }) => (
      <>
        <Menu.Item leftSection={<IconSend />} onClick={() => handleSendResponseClick(row)}>
          Send Response
        </Menu.Item>
        <Menu.Item leftSection={<IconExchange />} onClick={() => table.setEditingRow(row)}>
          Change Status
        </Menu.Item>
      </>
    ),
    renderDetailPanel: ({ row }) => (
      <div>
        <h3>Description</h3>
        <p>{row.original.description}</p>
      </div>
    ),
    mantinePaperProps: {
      style: {
        '--mrt-base-background-color': convertToRgba(theme?.colors?.gray?.[0] ?? '', 1),
        '--mrt-row-hover-background-color': ' #fff',
        '--mrt-selected-row-background-color': '#000',
        height: '100%',
        //get rid of border
        border: 'none',
      },
    },
    enablePagination: false,
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Edit User</Title>

        {internalEditComponents}

        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    onEditingRowSave: handleSaveUser,
  });

  return (
    <ScrollArea>
      <MantineReactTable table={table} />
      {isModalOpen && (
        <Modal
          opened={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Send Response"
          size="md"
        >
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: 250 }}>
            <Textarea
              placeholder="Type your response here..."
              value={response}
              onChange={(event) => debouncedChangeHandler(event.currentTarget.value)}
              minRows={5}
              style={{ flex: '1 0 auto' }}
              styles={{
                input: {
                  minHeight: 250,
                },
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1em' }}>
              <Button
                color="blue"
                onClick={() => handleSubmitResponse(table.getState().hoveredRow)}
              >
                Submit
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </ScrollArea>
  );
};

export default TicketTable;