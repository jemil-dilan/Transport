export type GetStyleInfo = (resolved: any) => {
  className: string;
  styles: Record<string, string> | null;
};

export function initDesignMode(getStyleInfo: GetStyleInfo): () => void {
  return () => {
    // No-op mock for production/un-monoreped environments
  };
}
