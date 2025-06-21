import { toast } from 'react-toastify';

const toastCache = {};

const showToast = (type, message, id) => {
  const toastId = id || type;

  // Không hiển thị lại toast cũ
  if (toastCache[toastId]) return;

  const newToastId = toast[type](message, {
    onClose: () => {
      delete toastCache[toastId];
    },
  });

  toastCache[toastId] = newToastId;
};

export default showToast;
