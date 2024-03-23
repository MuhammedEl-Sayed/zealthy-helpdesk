import React, { useState } from 'react';
import { Container, Paper, TextInput, Textarea, Button, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconChecks } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import styles from './SubmitForm.module.css';
import { theme } from '@/theme';
import { useTickets } from '@/contexts/TicketsContext';
import { Status } from '@/consts/Status';
import { IconButton } from '../IconButton/IconButton';

export const SubmitForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null); // Add this line

  const { addTicket } = useTickets();

  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      title: '',
      description: '',
    },

    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
      email: (value) =>
        /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(value) ? null : 'Invalid email',
      title: (value) => (value.length < 2 ? 'Title must have at least 2 letters' : null),
      description: (value) =>
        value.length < 10 ? 'Description must have at least 10 letters' : null,
    },
  });

  const onSubmit = async (values: Record<string, string>) => {
    try {
      await addTicket({
        id: null,
        title: values.title,
        name: values.name,
        email: values.email,
        status: Status.New,
        description: values.description,
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to add ticket:', error);
      setError(error); // Update the error state
    }
  };

  return (
    <Container className={styles.container}>
      <Paper className={styles.paper}>
        {isSubmitted ? ( // I'd prefer to use an animation here.
          <>
            <IconChecks size={48} color="green" />

            <IconButton
              text="Go to admin"
              onClick={() => {
                navigate('/admin');
              }}
            />
          </>
        ) : (
          <form onSubmit={form.onSubmit(onSubmit)}>
            <div className={styles.formGroup}>
              {error && (
                <Text c="red">{(error as Error).message ?? 'Error submitting ticket.'}</Text>
              )}
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

              <TextInput
                label="Title"
                labelProps={{ required: true }}
                placeholder="Enter a title"
                value={form.values.title}
                onChange={(event) => form.setFieldValue('title', event.currentTarget.value)}
                error={form.errors.title && 'Please enter a valid title'}
                styles={{
                  label: { fontWeight: 600, color: theme.colors?.blue?.[8] },
                }}
              />

              <Textarea
                label="Description"
                labelProps={{ required: true }}
                styles={{
                  label: { fontWeight: 600, color: theme.colors?.blue?.[8] },
                  input: { minHeight: 200, minWidth: 250 },
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
