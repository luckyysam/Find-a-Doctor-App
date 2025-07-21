import { type ClientLocation, type ProviderResults, type HealthcareProvider , type GeoapifyFeature} from "../types";

const apiKey = import.meta.env.VITE_GEOAPIFY_TOKEN;

const endpoints = {
  ipGeo: import.meta.env.VITE_GEOAPIFY_IP_GEOLOCATION_API, 
  places: import.meta.env.VITE_GEOAPIFY_PLACES_API,
};


// Get user location based on IP
export const getClientLocation = async (): Promise<ClientLocation> => {
  const url = `${endpoints.ipGeo}&apiKey=${apiKey}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("IP Geolocation failed");

  const data = await res.json();

  return {
    city: {
      names: {
        en: data.city?.names?.en,
      },
    },
    country: {
      iso_code: data.country?.iso_code,
      names: {
        en: data.country?.names?.en,
      },
    },
    ip: data.ip,
    location: {
      latitude: data.location?.latitude,
      longitude: data.location?.longitude,
    },
  };

  // return res.json();
};

// Search for clinics using 1 specialty and a bounding circle
export const getHealthcareProviders = async (
  specialty: string,
  lat: number,
  lon: number,
  radius: number = 10000 // default 10km
): Promise<ProviderResults> => {
  const category = `healthcare.${specialty}`;
  const filter = `circle:${lon},${lat},${radius}`;
  const limit = 500;

  const url = `${endpoints.places}categories=${category}&filter=${filter}&limit=${limit}&apiKey=${apiKey}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Places API failed");

  const data = await res.json();


  // Map each feature to HealthcareProvider interface
  const HealthcareProviders: HealthcareProvider[] = (data.features || {}).map((healthcare: GeoapifyFeature) => ({
    properties: {
      name: healthcare.properties?.name,
      country: healthcare.properties?.country,
      country_code: healthcare.properties?.country_code,
      region: healthcare.properties?.region,
      state: healthcare.properties?.state,
      city: healthcare.properties?.city,
      municipality: healthcare.properties?.municipality,
      postcode: healthcare.properties?.postcode,
      district: healthcare.properties?.district,
      suburb: healthcare.properties?.suburb,
      street: healthcare.properties?.street,
      housenumber: healthcare.properties?.housenumber,
      iso3166_2: healthcare.properties?.iso3166_2,
      lon: healthcare.properties?.lon,
      lat: healthcare.properties?.lat,
      formatted: healthcare.properties?.formatted,
      address_line1: healthcare.properties?.address_line1,
      address_line2: healthcare.properties?.address_line2,
      phone: healthcare.properties?.datasource?.raw?.phone,
      email: healthcare.properties?.datasource?.raw?.email,
      osm_id: healthcare.properties?.datasource?.raw?.osm_id,
      amenity: healthcare.properties?.datasource?.raw?.amenity,
      website: healthcare.properties?.datasource?.raw?.website,
      osm_type: healthcare.properties?.datasource?.raw?.osm_type,
      healthcare: healthcare.properties?.datasource?.raw?.healthcare,
      opening_hours: healthcare.properties?.datasource?.raw?.opening_hours,
      place_id: healthcare.properties?.place_id,
    },
    geometry: {
      type: healthcare.geometry?.type,
      coordinates: healthcare.geometry?.coordinates,
    }
  }));
  console.log('HEALTHCARE PROVIDERS', HealthcareProviders)

  return { HealthcareProviders };

  // return res.json();
};
