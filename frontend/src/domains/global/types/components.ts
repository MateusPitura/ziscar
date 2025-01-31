export interface Childrenable {
  children?: React.ReactNode;
}

export interface Dialog {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  toggleDialog: () => void;
  handleOpen: (state: boolean) => void;
}
