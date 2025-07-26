import { UnwrapArray } from "../types";

interface ParseAddressPayloadProperties<T extends unknown[]> {
  newAddress?: T;
  oldAddress?: Record<string, string>[];
}

export default function parseAddressPayload<T extends unknown[]>({
  newAddress,
  oldAddress,
}: ParseAddressPayloadProperties<T>):
  | Record<string, NonNullable<UnwrapArray<T>> | boolean>
  | undefined {
  if (!newAddress) return undefined;

  const address = newAddress[0] as NonNullable<UnwrapArray<T>>;

  if (address && !oldAddress?.length) {
    return {
      add: address,
    };
  } else if (address && oldAddress?.length) {
    return {
      update: address,
    };
  } else if (!address && oldAddress?.length) {
    return {
      remove: true,
    };
  }
}
