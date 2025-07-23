/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ClientIPLocation {
  city?: {
    names: {
        en: string
    }
  }
  country: {
    iso_code: string
    name_native: string
  }
  ip?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export type languageContent = {
    language: string,
    language_code: string
}

export type Language = languageContent[]


export interface HealthcareProvider {
  properties: {
    name?: string;
    country?: string
    country_code?: string
    region?: string
    state?: string
    city?: string
    municipality?: string
    postcode?: string
    district?: string
    suburb?: string
    street?: string
    housenumber?: string
    iso3166_2?: string
    lon?: number
    lat?: number
    formatted?: string
    address_line1?: string
    address_line2?: string
    phone?: string
    email?: string
    osm_id?: number
    amenity?: string
    website?: string
    osm_type?: string
    healthcare?: string
    opening_hours?: string
    place_id?: number

  };
  geometry: {
    type: string;
    coordinates: number[];
  }
}

export interface ProviderResults {
  HealthcareProviders: HealthcareProvider[];
}

export interface GeoapifyFeature {
  properties: Record<string, any> & {
    datasource?: {
      raw?: Record<string, any>;
    };
  };
  geometry: {
    type: string;
    coordinates: number[];
  };
}

export interface AIResponse {
    text: string
    specialties: string[]
}

export interface SpecialtyCardContent {
 icon_link:string
 h3:string
 p:string 
 a:string
}
