import { AddressFormInputs } from "@/domains/users/types";

interface ParseAddressPayloadProperties {
  newAddress?: AddressFormInputs[];
  oldAddress?: Record<string, string>[];
}

export default function parseAddressPayload({
  newAddress,
  oldAddress,
}: ParseAddressPayloadProperties):
  | Record<string, Omit<AddressFormInputs, "state"> | boolean>
  | undefined {
  if (!newAddress) return;

  if (!newAddress.length) {
    if (!oldAddress?.length) return;
    return {
      remove: true,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { state, ...addressRest } = newAddress[0];

  if (addressRest && !oldAddress?.length) {
    return {
      add: addressRest,
    };
  } else if (addressRest && oldAddress?.length) {
    return {
      update: addressRest,
    };
  }
}
