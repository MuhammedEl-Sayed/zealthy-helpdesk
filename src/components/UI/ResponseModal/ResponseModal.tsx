import { Modal, Textarea, Button, Text } from '@mantine/core';
import React from 'react';

interface ResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (response: string) => void;
  response: string;
  setResponse: (response: string) => void;
  error?: Error | null;
}

export const ResponseModal = ({
  isOpen,
  onClose,
  onSubmit,
  response,
  setResponse,
  error,
}: ResponseModalProps) => {
  const handleSubmitResponse = () => {
    onSubmit(response);
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Send Response" size="md">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 250 }}>
        {error && <Text c="red">{(error as Error).message ?? 'Error submitting ticket.'}</Text>}
        <Textarea
          placeholder="Type your response here..."
          value={response}
          onChange={(event) => setResponse(event.currentTarget.value)}
          minRows={5}
          style={{ flex: '1 0 auto' }}
          styles={{
            input: {
              minHeight: 250,
            },
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1em' }}>
          <Button color="blue" onClick={handleSubmitResponse}>
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
};
