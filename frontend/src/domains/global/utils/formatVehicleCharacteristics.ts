interface FormatVehicleCharacteristicsProperties {
  vehicleCharacteristicValues: Record<string, string>[];
}

export default function formatVehicleCharacteristics({
  vehicleCharacteristicValues,
}: FormatVehicleCharacteristicsProperties): string[] {
  return vehicleCharacteristicValues.map((c) => c?.characteristic);
}
