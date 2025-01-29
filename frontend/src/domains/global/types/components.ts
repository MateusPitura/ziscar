export interface Childrenable {
  children?: React.ReactNode;
}

export interface Dialog {
  open: boolean;
  onClose: () => void;
}
