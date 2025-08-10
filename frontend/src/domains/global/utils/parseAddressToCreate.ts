import { AddressFormInputs } from "../types";

interface ParseAddressToCreateProperties {
  address?: AddressFormInputs[];
}

export default function parseAddressToCreate({
  address,
}: ParseAddressToCreateProperties): Omit<AddressFormInputs, "state"> | null {
  if (address?.length && address.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { state, ...addressRest } = address[0];
    return addressRest;
  } else {
    return null;
  }
}
