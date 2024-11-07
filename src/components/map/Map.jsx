import { useEffect, useState, useCallback, memo } from "react";
import { apiCoordinates } from "../../apiService/ApiService";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./styles.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const clientIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const collaboratorIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Componente memoizado para o marcador do cliente
const ClientMarker = memo(({ position, eircode }) => (
  <Marker position={position} icon={clientIcon}>
    <Popup>Cliente: {eircode}</Popup>
  </Marker>
));

// Componente memoizado para os marcadores dos colaboradores
const CollaboratorMarkers = memo(({ markers }) => (
  <>
    {markers.map((marker, index) => (
      <Marker
        key={`collaborator-${index}`}
        position={marker.position}
        icon={collaboratorIcon}
      >
        <Popup>Colaborador: {marker.name}</Popup>
      </Marker>
    ))}
  </>
));

export const Map = memo(({ clientEircode, collaboratorEircode }) => {
  const [mapState, setMapState] = useState({
    center: [53.3498, -6.2603],
    clientMarker: null,
    collaboratorMarkers: [],
    loading: true
  });

  console.log('Colla', collaboratorEircode)

  const formatEircode = useCallback((eircode) => {
    return eircode?.replace(/\s/g, '');
  }, []);

  const fetchClientLocation = useCallback(async (eircode) => {
    if (!eircode) return null;

    const formattedEircode = formatEircode(eircode);
    try {
      const response = await apiCoordinates.get(
        `/v1/json?q=${formattedEircode},Ireland&key=3460b51491f8407fb62f9a418a0b0231`
      );

     // console.log("API response for client:", response.data);

      if (response.data?.results?.[0]?.geometry) {
        const { lat, lng } = response.data.results[0].geometry;
        return {
          position: [lat, lng],
          eircode
        };
      }
    } catch (error) {
      console.error("Erro ao buscar localização do cliente:", error);
    }
    return null;
  }, [formatEircode]);

  const fetchCollaboratorLocations = useCallback(async (collaborators) => {
    if (!collaborators?.result?.length) return [];
  
    const promises = collaborators.result.map(async (collaborator) => {
      const formattedEircode = formatEircode(collaborator.eircode);
      try {
        const response = await apiCoordinates.get(
          `/v1/json?q=${formattedEircode},Ireland&key=3460b51491f8407fb62f9a418a0b0231`
        );
  
        console.log(`API response for collaborator ${collaborator.name}:`, response.data);
  
        const results = response.data?.results;
  
        if (results?.length) {
          // Encontrar o resultado com coordenadas lat e lng mais longas
          let selectedResult = null;
          let maxDistanceSquared = -Infinity; // Começa com o menor valor possível
  
          results.forEach(result => {
            if (result?.geometry?.lat && result?.geometry?.lng) {
              const distanceSquared = result.geometry.lat ** 2 + result.geometry.lng ** 2;
  
              if (distanceSquared > maxDistanceSquared) {
                maxDistanceSquared = distanceSquared;
                selectedResult = result;
              }
            }
          });
  
          if (selectedResult?.geometry) {
            const { lat, lng } = selectedResult.geometry;
            return {
              position: [lat, lng],
              name: collaborator.name
            };
          }
        }
      } catch (error) {
        console.error(`Erro ao buscar localização para ${collaborator.name}:`, error);
      }
      return null;
    });
  
    const results = await Promise.all(promises);
    return results.filter(Boolean);
  }, [formatEircode]);
  

  useEffect(() => {
    let isActive = true;

    const fetchLocations = async () => {
      setMapState(prev => ({ ...prev, loading: true }));

      try {
        const [clientMarker, collaboratorMarkers] = await Promise.all([
          fetchClientLocation(clientEircode),
          fetchCollaboratorLocations(collaboratorEircode)
        ]);

        if (isActive) {
          setMapState({
            center: clientMarker?.position || [53.3498, -6.2603],
            clientMarker,
            collaboratorMarkers,
            loading: false
          });
        }
      } catch (error) {
        console.error("Erro ao buscar localizações:", error);
        if (isActive) {
          setMapState(prev => ({ ...prev, loading: false }));
        }
      }
    };

    fetchLocations();

    return () => {
      isActive = false;
    };
  }, [clientEircode, collaboratorEircode, fetchClientLocation, fetchCollaboratorLocations]);

  if (mapState.loading) {
    return <div>Carregando o mapa...</div>;
  }

console.log('oiii', mapState)

  return (
    <section className="mapContainer">
      <MapContainer 
        center={mapState.center} 
        zoom={13} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {mapState.clientMarker && (
          <ClientMarker 
            position={mapState.clientMarker.position}
            eircode={mapState.clientMarker.eircode}
          />
        )}

        <CollaboratorMarkers markers={mapState.collaboratorMarkers} />
      </MapContainer>
    </section>
  );
});



