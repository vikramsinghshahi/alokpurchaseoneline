import Swal from 'sweetalert2';

export async function AgGridDeleteEditor(id, gridProps) {
  const { gridTitle, onDelete, uniqueTitle, deleteMessage } = gridProps;
  const gridUniqueItemTitle =
    (uniqueTitle && uniqueTitle.toLowerCase()) ||
    (gridTitle && gridTitle.substring(0, gridTitle.length - 1).toLowerCase()) ||
    '';
  if (typeof onDelete !== 'function') {
    throw new Error('handleDelete property must be a function!');
  }

  const messageBody = `All data and settings for this ${
    gridUniqueItemTitle || 'item'
  } will be deleted!`;

  return Swal.fire({
    title: 'Are you sure?',
    text: deleteMessage || messageBody,
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    customClass: {
      popup: 'center-alert',
    },
  }).then(async (result) => {
    if (result.value) {
      await onDelete(id).then((res) => {
        if (res) {
          Swal.fire(
            'Deleted!',
            `${gridUniqueItemTitle || 'item'} has been deleted.`,
            'success'
          );
        } else {
          Swal.fire(
            'Error',
            `This ${
              gridUniqueItemTitle || 'item'
            } is probably being used and cannot be deleted.`,
            'error'
          );
        }
      });
    }
    return result;
  });
}
