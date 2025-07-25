interface ParseAddressPayloadProperties<T> {
  newAddress?: T;
  oldAddress?: Record<string, string>[];
}

export default function parseAddressPayload<T>({
  newAddress,
  oldAddress,
}: ParseAddressPayloadProperties<T>):
  | Record<string, NonNullable<T> | boolean>
  | undefined {
  if (newAddress && !oldAddress?.length) {
    return {
      add: newAddress,
    };
  } else if (newAddress && oldAddress?.length) {
    return {
      update: newAddress,
    };
  } else if (!newAddress && oldAddress?.length) {
    return {
      remove: true,
    };
  }
}
