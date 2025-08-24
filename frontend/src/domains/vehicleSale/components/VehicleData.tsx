import Spinner from "@/design-system/Spinner";
import DataField from "@/domains/global/components/DataField";
import { Vehicle } from "@/domains/global/types/model";
import {
  FuelTypeText,
  VehicleCategoryText,
  VehicleStatusText,
} from "@/domains/vehicles/constants";
import { FuelType, VehicleCategory, VehicleStatus } from "@shared/enums";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import selectVehicleInfo from "../utils/selectVehicleInfo";
// import useSafeFetch from "@/domains/global/hooks/useSafeFetch";

export default function VehicleData(): ReactNode {
  //   const { safeFetch } = useSafeFetch();
  const { vehicleId } = useParams();

  async function getVehicle(): Promise<Vehicle> {
    // return await safeFetch(`${BACKEND_URL}/vehicle/${vehicleId}`, {
    //   resource: "VEHICLES",
    //   action: "READ",
    // });

    return {
      id: 1,
      modelName: "Fusca",
      announcedPrice: "8000000",
      plateNumber: "ABC1234",
      modelYear: "1970",
      status: VehicleStatus.DELIVERED,
      archivedAt: undefined,
      brand: {
        id: 10,
        name: "Volkswagen",
      },
      store: {
        id: 1,
        name: "Loja 1",
      },
      category: VehicleCategory.CAR,
      color: "#FFFFFF",
      chassiNumber: "AAAAAAAAAAAAAAAAA",
      commissionValue: "1000",
      fuelType: FuelType.FLEX,
      kilometers: "1000",
      minimumPrice: "8000000",
      yearOfManufacture: "1970",
      characteristics: [
        "Direção hidráulica",
        "Janelas elétricas",
        "Ar condicionado",
        "Travas elétricas",
        "Câmera de ré",
        "Air bag",
        "Rodas de liga leve",
      ],
    };
  }

  const { data: vehicleData, isFetching } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: getVehicle,
    select: selectVehicleInfo,
  });

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  return (
    vehicleData && (
      <>
        <DataField label="Número da placa" value={vehicleData.plateNumber} />
        <DataField label="Número do chassi" value={vehicleData.chassiNumber} />
        <DataField label="Loja" value={vehicleData.store.name} />
        <DataField label="Preço mínimo" value={vehicleData.minimumPrice} />
        <DataField label="Preço anunciado" value={vehicleData.announcedPrice} />
        <DataField
          label="Valor da comissão"
          value={vehicleData.commissionValue}
        />
        <DataField
          label="Status"
          value={VehicleStatusText[vehicleData.status]}
        />
        <DataField
          label="Quilometragem"
          value={vehicleData.kilometers}
        />
        <DataField
          label="Categoria"
          value={VehicleCategoryText[vehicleData.category]}
        />
        <DataField label="Modelo" value={vehicleData.modelName} />
        <DataField label="Marca" value={vehicleData.brand.name} />
        <DataField label="Cor" value={vehicleData.color} />
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
    )
  );
}
