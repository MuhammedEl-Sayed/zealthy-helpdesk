import { Button, Text } from '@mantine/core';
import React from 'react';
import classes from './IconButtonWithNumber.module.css';
import { theme } from '@/theme';
import { convertToRgba } from '@/utils/convertToRgba';

interface IconButtonProps {
  leftIcon?: React.ReactNode;
  text: string;
  onClick: () => void;
  number: number;
  selected?: boolean;
}

export const IconButtonWithNumber = ({
  leftIcon,
  text,
  onClick,
  number,
  selected = true,
}: IconButtonProps) => {
  const color = selected ? theme.colors?.green?.[8] : theme.colors?.blue?.[8];
  const backgroundColor = selected
    ? convertToRgba(theme.colors?.green?.[3] as string, 0.3)
    : '#fff';

  return (
    <Button
      justify="space-between"
      leftSection={
        <div className={classes.leftSection}>
          {leftIcon}
          <Text className={classes.text} c={color}>
            {text}
          </Text>
        </div>
      }
      rightSection={
        <Text className={classes.rightSection} c={color}>
          {number}
        </Text>
      }
      onClick={onClick}
      styles={{
        root: {
          backgroundColor,
        },
      }}
      className={classes.root}
    />
  );
};
