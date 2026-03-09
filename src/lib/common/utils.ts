export const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export type SharedMetadata = {
  duration: number;
};

export const createSharedMetadata = (): SharedMetadata => {
  return {
    duration: 0,
  };
};