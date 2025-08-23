import { Options } from "@/domains/global/types";
import { FetchBrand } from "@/domains/global/types/model";

export default function selectBrandsInfo(payload: FetchBrand[]): Options[] {
  return payload.map((brand) => ({
    label: brand.name,
    value: String(brand.id),
  }));
}
