import { useEffect, useState } from "react";
import { getClientLocation, getHealthcareProviders } from "../services/geoapify";
import { type ProviderResults, type HealthcareProvider } from "../types";

const HealthcareProviderSearch = ({ specialty }: { specialty: string }) => {
  const [healthcareProviders, setHealthcareProviders] = useState<ProviderResults | null >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchProviders = async () => {
      try {
        const locationData = await getClientLocation();

        console.log('LOCATION DATA', locationData)

        const [lat, lon] = locationData.location?.latitude
          ? [locationData.location.latitude, locationData.location.longitude]
          : [60.1695, 24.9354]; // fallback: Helsinki

        const data = await getHealthcareProviders(specialty.toLowerCase(), lat, lon);
        console.log('DATASETS ', data)
        setHealthcareProviders(data);
      } catch (err) {
        console.error("Error searching doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    searchProviders();
  }, [specialty]);

  return (
    <div>
      {loading ? (
        <p>Loading nearby doctors...</p>
      ) : (
        'here'
      )}
    </div>
  );
};

export default HealthcareProviderSearch;
