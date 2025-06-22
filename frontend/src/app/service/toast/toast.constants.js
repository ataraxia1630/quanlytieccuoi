// Toast configuration constants
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  DEFAULT: 'default'
};

export const TOAST_POSITIONS = {
  TOP_RIGHT: 'top-right',
  TOP_LEFT: 'top-left',
  TOP_CENTER: 'top-center',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_CENTER: 'bottom-center'
};

export const TOAST_DURATIONS = {
  SHORT: 2000,
  NORMAL: 3000,
  LONG: 5000,
  VERY_LONG: 8000
};

// Default toast configurations for different types
export const DEFAULT_TOAST_CONFIG = {
  [TOAST_TYPES.SUCCESS]: {
    position: TOAST_POSITIONS.TOP_RIGHT,
    autoClose: TOAST_DURATIONS.NORMAL,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  },
  [TOAST_TYPES.ERROR]: {
    position: TOAST_POSITIONS.TOP_RIGHT,
    autoClose: TOAST_DURATIONS.LONG,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  },
  [TOAST_TYPES.WARNING]: {
    position: TOAST_POSITIONS.TOP_RIGHT,
    autoClose: TOAST_DURATIONS.NORMAL + 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  },
  [TOAST_TYPES.INFO]: {
    position: TOAST_POSITIONS.TOP_RIGHT,
    autoClose: TOAST_DURATIONS.NORMAL,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  }
};

// Theme configurations
export const TOAST_THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  COLORED: 'colored'
};
