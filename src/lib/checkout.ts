import locations from "./locations.json";
import { Baghoroo, Country, State } from "../types/Checkout";
import { CustomerType } from "../types/Common";

const slocaltion: {
  cities: Country[];
  districts: State[];
  baghoroo?: Baghoroo[];
} = { cities: [], districts: [], baghoroo: [] };

export function shipmentLocations(
  selectedCity: string,
  selectedDistrict?: string
) {
  slocaltion.cities = Object.values(locations);
  const sd = locations[selectedCity as keyof typeof locations]?.sumDuureg;

  if (sd) {
    slocaltion.districts = Object.values(sd);
    if (selectedDistrict) {
      if (sd[selectedDistrict as keyof typeof sd]?.baghoroo) {
        slocaltion.baghoroo = Object.values(
          sd[selectedDistrict as keyof typeof sd]?.baghoroo
        );
      }
    } else {
      slocaltion.baghoroo = [];
    }
  }

  return slocaltion;
}

interface LocationData {
  label: string;
  sumDuureg: Record<string, DistrictData>;
}

interface DistrictData {
  label: string;
  baghoroo?: Record<string, BaghorooData>;
}

interface BaghorooData {
  label: string;
}

export function getFullAddress(
  selectedCity: string,
  selectedDistrict?: string,
  selectedBaghoroo?: string
): string {
  const locationData: LocationData =
    locations[selectedCity as keyof typeof locations];

  if (locationData) {
    const districtData: DistrictData | undefined =
      locationData.sumDuureg[selectedDistrict ?? ""];

    let address = locationData.label;

    if (districtData) {
      const districtLabel = districtData.label;
      address += `, ${districtLabel}`;

      if (districtData.baghoroo && selectedBaghoroo) {
        const baghorooData: BaghorooData | undefined =
          districtData.baghoroo[selectedBaghoroo];

        if (baghorooData) {
          const baghorooLabel = baghorooData.label;
          address += `, ${baghorooLabel}`;
        }
      }
    }

    return address;
  }

  return "";
}

export function addressManage(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formSubmit: any,
  customerType: CustomerType,
  shipment_id?: number
) {
  return {
    //products: cart.products,
    shipment_id: shipment_id,
    ship_to_another: 0,
    user_data: {
      ...formSubmit,
      state: formSubmit?.district,
      country: formSubmit?.city,
      s_state: formSubmit.district,
      s_country: formSubmit.city,
      "shipment_ids[]": shipment_id,
      recalculate: true,
      calculate_shipping: "A",
      guest_checkout: true,
      ship_to_another: 0,
      customer_type: customerType,
    },
  };
}
