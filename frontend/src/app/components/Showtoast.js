import { toast } from 'react-toastify';

const toastCache = {};

const showToast = (type, message, id) => {
  const toastId = id || type;

  if (toastCache[toastId]) {
    toast.dismiss(toastCache[toastId]);
  }

  const newToastId = toast[type](message);
  toastCache[toastId] = newToastId;
};

export default showToast;
