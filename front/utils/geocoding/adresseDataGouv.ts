/**
 * Util for interacting with the official French API https://adresse.data.gouv.fr/api-doc/adresse
 */

export interface IDataGouvSearchParams {
  q: string; // The full address to search for.
  limit?: number; // The maximum number of results returned (default is 5).
  autocomplete?: 1 | 0; // Enable or disable the autocomplete feature (default is 1).
  lat?: number; // Latitude for the center of the bounding box.
  lon?: number; // Longitude for the center of the bounding box.
}

export interface IDataGouvReverseParams {
  lat: number; // Latitude of the location to reverse geocode.
  lon: number; // Longitude of the location to reverse geocode.
}

interface IDataGouvProperties {
  label: string;
  score: number;
  housenumber?: string;
  id: string;
  type: string;
  name: string;
  postcode: string;
  citycode: string;
  x: number;
  y: number;
  city: string;
  context: string;
  importance: number;
  street?: string;
}

export interface IAddressFranceDetails {
  label?: string;
  housenumber?: string;
  postcode?: string;
  city?: string;
  street?: string;
}

export interface IDataGouvSearchResult {
  type: string; // The type of location found (e.g., "housenumber", "street", etc.).
  label: string; // The full address label.
  x: number; // Longitude.
  y: number; // Latitude.
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: IDataGouvProperties;
}

const DATAGOUV_ENDPOINT = "https://api-adresse.data.gouv.fr/";

export default class DataGouv {
  /**
   * Search for an address using the DataGouv API.
   * @param params The search parameters.
   */
  public static async search(params: IDataGouvSearchParams): Promise<IDataGouvSearchResult[]> {
    const url = new URL(`${DATAGOUV_ENDPOINT}search`);
    Object.keys(params).forEach((key) => {
      const value = params[key as keyof IDataGouvSearchParams];
      if (value !== undefined) {
        url.searchParams.append(key, value?.toString());
      }
    });

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`DataGouv API request failed with status: ${response.statusText}`);
    }

    const data = await response.json();
    return data.features.map((feature: any) => ({
      type: feature.properties.type,
      label: feature.properties.label,
      x: feature.geometry.coordinates[0],
      y: feature.geometry.coordinates[1],
      geometry: {
        type: feature.geometry.type,
        coordinates: feature.geometry.coordinates,
      },
      properties: feature.properties,
    }));
  }

  /**
   * Reverse geocode a set of coordinates to find the corresponding address using the DataGouv API.
   * @param params The reverse geocoding parameters.
   */
  public static async reverse(params: IDataGouvReverseParams): Promise<IDataGouvSearchResult> {
    const url = new URL(`${DATAGOUV_ENDPOINT}reverse`);
    url.searchParams.append("lat", params.lat.toString());
    url.searchParams.append("lon", params.lon.toString());

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`DataGouv API request failed with status: ${response.statusText}`);
    }

    const data = await response.json();
    const feature = data?.features?.[0]; // Assuming there is at least one result.
    return {
      type: feature.properties.type,
      label: feature.properties.label,
      x: feature.geometry.coordinates[0],
      y: feature.geometry.coordinates[1],
      geometry: {
        type: feature.geometry.type,
        coordinates: feature.geometry.coordinates,
      },
      properties: feature.properties,
    };
  }
}
