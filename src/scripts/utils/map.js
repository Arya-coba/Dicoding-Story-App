import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapUtils = {
  initMap({ container, center = [0, 0], zoom = 2, onClickCallback = null }) {
    const [lat, lng] = center;

    const map = L.map(container).setView([lat, lng], zoom);

    const openStreet = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    });

    const topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors',
    });

    const satellite = L.tileLayer("https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps',
    });

    openStreet.addTo(map);

    const baseMaps = {
      "OpenStreetMap": openStreet,
      "Topographic": topo,
      "Satellite": satellite,
    };

    L.control.layers(baseMaps).addTo(map);

    if (typeof onClickCallback === "function") {
      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        onClickCallback(lng, lat);
      });
    }

    return map;
  },

  addMarker({ map, lng, lat, popupText = "" }) {
    const marker = L.marker([lat, lng]);

    if (popupText) {
      marker.bindPopup(popupText);
    }

    marker.addTo(map);
    return marker;
  },
};


export default MapUtils;
