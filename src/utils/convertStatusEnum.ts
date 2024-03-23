export const convertStatusEnum = (status: string) => {
  switch (status) {
    case 'inprogress':
      return 'In Progress';
    case 'new':
      return 'New';
    case 'resolved':
      return 'Resolved';
    default:
      return 'Unknown';
  }
};
