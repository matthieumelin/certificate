const prefix = import.meta.env.VITE_APP_NAME;

const title = (suffix?: string): string => {
  return suffix ? `${suffix} - ${prefix}` : prefix;
};

export default title;
