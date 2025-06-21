import { toast } from 'react-toastify';

const toastCache = {};

// Default toast options
const defaultOptions = {
  position: "top-right",
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Type-specific options
const typeOptions = {
  success: { autoClose: 3000 },
  error: { autoClose: 5000 },
  warning: { autoClose: 4000 },
  info: { autoClose: 3000 },
};

const smartToast = (type, message, id, customOptions = {}) => {
  const toastId = id || type;

  // Không hiển thị lại toast cũ
  if (toastCache[toastId]) return;

  // Merge options: default + type-specific + custom
  const options = {
    ...defaultOptions,
    ...typeOptions[type],
    ...customOptions,
    onClose: () => {
      delete toastCache[toastId];
    },
  };

  // Show new toast with merged options
  const newToastId = toast[type](message, options);
  toastCache[toastId] = newToastId;

  return newToastId;
};

// Utility function to clear toast cache
smartToast.clearCache = () => {
  Object.keys(toastCache).forEach(key => {
    toast.dismiss(toastCache[key]);
    delete toastCache[key];
  });
};

// Utility function to get cache status (for debugging)
smartToast.getCacheStatus = () => {
  return Object.keys(toastCache).map(key => ({
    id: key,
    toastId: toastCache[key]
  }));
};

// Utility function to remove specific toast from cache
smartToast.removeFromCache = (id) => {
  if (toastCache[id]) {
    toast.dismiss(toastCache[id]);
    delete toastCache[id];
  }
};

// Utility function to check if toast exists in cache
smartToast.isInCache = (id) => {
  return toastCache[id] !== undefined;
};

export default smartToast;
