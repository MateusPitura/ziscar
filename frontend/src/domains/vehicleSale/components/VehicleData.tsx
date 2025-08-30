import ColorPreview from "@/design-system/ColorPreview";
import DataField from "@/domains/global/components/DataField";
import {
  FuelTypeText,
  VehicleCategoryText,
  VehicleStatusText,
} from "@/domains/vehicles/constants";
import type { ReactNode } from "react";
import { VehicleToString } from "../types";

interface VehicleDataProperties {
  vehicleData: VehicleToString;
}

export default function VehicleData({
  vehicleData,
}: VehicleDataProperties): ReactNode {
  return (
    <>
      <DataField label="Número da placa" value={vehicleData.plateNumber} />
      <DataField label="Número do chassi" value={vehicleData.chassiNumber} />
      <DataField label="Loja" value={vehicleData.store.name} />
      <DataField label="Preço mínimo" value={vehicleData.minimumPrice} />
      <DataField label="Preço anunciado" value={vehicleData.announcedPrice} />
      <DataField
        label="Comissão máxima"
        value={vehicleData.commissionValue}
      />
      <DataField label="Status" value={VehicleStatusText[vehicleData.status]} />
      <DataField label="Quilometragem" value={vehicleData.kilometers} />
      <DataField
        label="Categoria"
        value={VehicleCategoryText[vehicleData.category]}
      />
      <DataField label="Modelo" value={vehicleData.modelName} />
      <DataField label="Marca" value={vehicleData.brand.name} />
      <DataField
        label="Cor"
        value={<ColorPreview color={vehicleData.color} />}
      />
      <DataField
        label="Ano de fabricação"
        value={vehicleData.yearOfManufacture}
      />
      <DataField label="Ano do modelo" value={vehicleData.modelYear} />
      <DataField
        label="Tipo de combustível"
        value={FuelTypeText[vehicleData.fuelType]}
      />
      <div className="col-span-3">
        <DataField
          label="Características"
          value={vehicleData.characteristics.join(", ")}
        />
      </div>
    </>
  );
}
