import { Flex, LoadingOverlay, Menu, ScrollArea, Stack, Title } from '@mantine/core';
import { Status } from '@/consts/Status';
import { useTickets } from '@/contexts/TicketsContext';
import { theme } from '@/theme';
import { Ticket } from '@/types/ticket';
import { convertStatusEnum } from '@/utils/convertStatusEnum';
import { convertToRgba } from '@/utils/convertToRgba';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { IconCirclePlus, IconExchange, IconSend } from '@tabler/icons-react';
import {
  MRT_EditActionButtons,
  MRT_RowData,
  MRT_TableOptions,
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import 'mantine-react-table/styles.css';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '../IconButton/IconButton';
import { ResponseModal } from '../ResponseModal/ResponseModal';
import { StatusBadge } from '../StatusBadge/StatusBadge';

interface TicketTableProps {
  filter: Status | null;
}

const TicketTable = ({ filter }: TicketTableProps) => {
  const { tickets, updateTicket, respondToTicket, getTicketsByStatus } = useTickets();

  const [filteredData, setFilteredData] = useState(tickets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [response, setResponse] = useState('');
  const [selectedRow, setSelectedRow] = useState<MRT_RowData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
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

  const handleSendResponseClick = (row: MRT_RowData) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };
  const handleSubmitResponse = async () => {
    if (selectedRow && response.length > 0) {
      setIsLoading(true);
      try {
        await respondToTicket(selectedRow.original.id ?? '', response);
      } catch (err) {
        setIsLoading(false);
        setError(err as Error);
        return;
      }
      setIsModalOpen(false);
      setIsLoading(false);
      setResponse('');
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
            accessorKey: 'name',
            header: 'Name',
            size: 200,
            enableEditing: false,
          },
          {
            accessorKey: 'email',
            header: 'Email',
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

        border: '1px solid #e1e1e1',
      },
    },
    enablePagination: false,
    renderEditRowModalContent: ({ table: tableInstance, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Edit User</Title>

        {internalEditComponents}

        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={tableInstance} row={row} />
        </Flex>
      </Stack>
    ),
    onEditingRowSave: handleSaveUser,
    renderTopToolbar: () => (
      <IconButton
        leftIcon={<IconCirclePlus color={theme.colors?.green?.[8]} />}
        text="Submit a ticket"
        staticBackgroundColor="transparent"
        onClick={() => navigate('/')}
      />
    ),
  });

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <ScrollArea>
        <MantineReactTable table={table} />
        {isModalOpen && (
          <ResponseModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            error={error}
            response={response}
            setResponse={setResponse}
            onSubmit={handleSubmitResponse}
          />
        )}
      </ScrollArea>
    </>
  );
};

export default TicketTable;
