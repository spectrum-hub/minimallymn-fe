import locations from "../lib/locations.json";
import { LocationNType } from "../types/Common";

export function getLocationData(item?: {
  cityId?: string;
  districtId?: string;
  baghorooId?: string;
}): string {
  if (!item?.cityId) return "";

  const typedLocations = locations as LocationNType;

  const city = typedLocations?.[item.cityId];
  if (!city) return "";

  const parts: string[] = [city.label];

  if (item.districtId) {
    const district = city.sumDuureg?.[item.districtId];
    if (district?.label) {
      parts.push(district.label);

      if (item.baghorooId) {
        const baghoroo = district.baghoroo?.[item.baghorooId];
        if (baghoroo?.label) {
          parts.push(baghoroo.label);
        }
      }
    }
  }

  return parts.join(", ");
}

export function getCityName(code: string) {
  const typedLocations = locations as LocationNType;
  return typedLocations?.[code]?.label ?? "";
}

export function getDistrictName(cityId: string, districtId: string) {
  const typedLocations = locations as LocationNType;
  return typedLocations?.[cityId]?.sumDuureg?.[districtId]?.label ?? "";
}

export function getBaghorooName(
  cityId: string,
  districtId: string,
  baghorooId: string
) {
  const typedLocations = locations as LocationNType;
  return (
    typedLocations?.[cityId]?.sumDuureg?.[districtId]?.baghoroo?.[baghorooId]
      ?.label ?? ""
  );
}
