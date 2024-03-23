import { Badge, Text, useMantineTheme } from '@mantine/core';
import { convertStatusEnum } from '@/utils/convertStatusEnum';
import { Status } from '@/consts/Status';

export const StatusBadge = ({ status }: { status: Status }) => {
  const theme = useMantineTheme();
  let color: string;
  let textColor: string;

  switch (status) {
    case Status.New:
      {
        const [, , , , orange] = theme.colors.orange;
        color = orange;
        textColor = 'light';
      }
      break;
    case Status.InProgress:
      {
        const [, , , , , , blue] = theme.colors.blue;
        color = blue;
        textColor = 'light';
      }
      break;
    case Status.Resolved:
      {
        const [, , , , , , , , green] = theme.colors.green;
        color = green;
        textColor = 'light';
      }
      break;
    default: {
      const [, , , , , , gray] = theme.colors.gray;
      color = gray;
      textColor = 'dark';
    }
  }

  return (
    <Badge color={color}>
      <Text c={textColor} mx={5} size="12px">
        {convertStatusEnum(status)}
      </Text>
    </Badge>
  );
};
