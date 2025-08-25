import { useQuery } from "@apollo/client";
import { GET_LOCATIONS } from "../api";
 

interface Location {
  id: string;
  name: string;
  description: string;
  photo: string;
}

interface LocationsData {
  locations: Location[];
}

function DisplayLocations() {
  const { loading, error, data } = useQuery<LocationsData>(GET_LOCATIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (data?.locations ?? []).map(({ id, name, description, photo }) => (
    <div key={id}>
      <h3>{name}</h3>
      <img width="400" height="250" alt="location-reference" src={`${photo}`} />
      <br />
      <b>About this location:</b>
      <p>{description}</p>
      <br />
    </div>
  ));
}

export default DisplayLocations;
