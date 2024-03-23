import React, { useState } from 'react';
import { Container, Paper, TextInput, Textarea, Button, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconChecks } from '@tabler/icons-react';
import styles from './SubmitForm.module.css';
import { theme } from '@/theme';
import { useTickets } from '@/contexts/MessagesContext';
import { Status } from '@/consts/Status';

export const SubmitForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { addTicket } = useTickets();
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      description: '',
    },

    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      description: (value) =>
        value.length < 10 ? 'Description must have at least 10 letters' : null,
    },
  });

  const onSubmit = async (values: Record<string, string>) => {
    try {
      await addTicket({
        id: null,
        title: values.name,
        from: values.email,
        status: Status.New,
        description: values.description,
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to add ticket:', error);
    }
  };

  return (
    <Container className={styles.container}>
      <Paper className={styles.paper}>
        {isSubmitted ? (
          <IconChecks size={48} color="green" /> // I'd prefer to use an animation here.
        ) : (
          <form onSubmit={form.onSubmit(onSubmit)}>
            <div className={styles.formGroup}>
              <Text fw={700} size="xl" c={theme.colors?.blue?.[8]}>
                Submit a ticket
              </Text>
              <TextInput
                label="Name"
                labelProps={{ required: true }}
                placeholder="Enter your name"
                value={form.values.name}
                onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                error={form.errors.name && 'Please enter your name'}
                styles={{
                  label: { fontWeight: 600, color: theme.colors?.blue?.[8] },
                }}
              />

              <TextInput
                label="Email"
                labelProps={{ required: true }}
                placeholder="Enter your email"
                value={form.values.email}
                onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                error={form.errors.email && 'Please enter a valid email'}
                styles={{
                  label: { fontWeight: 600, color: theme.colors?.blue?.[8] },
                }}
              />

              <Textarea
                label="Description"
                labelProps={{ required: true }}
                styles={{
                  label: { fontWeight: 600, color: theme.colors?.blue?.[8] },
                }}
                placeholder="Enter a description"
                value={form.values.description}
                onChange={(event) => form.setFieldValue('description', event.currentTarget.value)}
                error={form.errors.description && 'Please enter a description'}
              />

              <Button
                type="submit"
                styles={{
                  label: { fontWeight: 700 },
                }}
                color={theme.colors?.green?.[8]}
              >
                Submit
              </Button>
            </div>
          </form>
        )}
      </Paper>
    </Container>
  );
};
