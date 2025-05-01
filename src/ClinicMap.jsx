
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

function ClinicMap({ clinics }) {
  const center = clinics.length
    ? clinics[0].location
    : { lat: 53.5461, lng: -113.4938 }; // Edmonton fallback

  return (
    <LoadScript googleMapsApiKey="AIzaSyBL9LH4AAN5s82wn4HAoBJT2DZey59RFPc">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        {clinics.map((clinic, index) => (
          <Marker key={index} position={clinic.location} title={clinic.name} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default ClinicMap;
