import { AfterViewInit, Component, OnInit } from '@angular/core';

// Importações do leafletMap.
import * as L from 'leaflet';
import 'leaflet-easybutton';
import '@bepo65/leaflet.fullscreen';

// importação das imagens dos icones -- de nodemodules para assets.
const iconRetinaUrl = './assets/marker-icon-2x.png';
const iconUrl = './assets/marker-icon.png';
const shadowUrl = './assets/marker-shadow.png';

const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
  map!: L.Map;
  marker: any = L.Marker;
  circle: any = L.Circle;
  center: any = [-15.623036831528252, -49.48242187500001];
  zoom: number = 4;
  receiveLonCurrent: number = 0;
  receiveLatCurrent: number = 0;

  // Visão satellite.
  satellite = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { maxZoom: 17, minZoom: 0 }
  );

  // Visão original.
  original = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    minZoom: 0,
  });

  constructor() {}

  // Método que irá inicializar o mapa quando ele estiver totalmente renderizado.
  ngAfterViewInit(): void {
    this.zoom = 4;
    this.initMap(); 

    navigator.geolocation.getCurrentPosition((position) => {
      this.receiveLatCurrent = position.coords.latitude;
      this.receiveLonCurrent = position.coords.longitude;
      this.center = [this.receiveLatCurrent, this.receiveLonCurrent];
      this.map.off();
      this.map.remove();
      this.zoom = 17;
      this.initMap();

      this.marker = L.marker([
        this.receiveLatCurrent,
        this.receiveLonCurrent,
      ]).addTo(this.map);       
      
      this.circle = L.circle([this.receiveLatCurrent, this.receiveLonCurrent], {
        color: 'steelblue',
        radius: 100,
        fillColor: 'steelblue',
        opacity: 0.9, 
      }).addTo(this.map);
    }); 
  }

  ngOnInit(): void {}

  // Método que inicializa o mapa
  initMap(): void {
    this.map = L.map('map', {
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: 'topleft',
        title: 'fullscreen map',
        titleCancel: 'exit fullscreen display',
        forceSeparateButton: true,
        content: '',
      },
      center: this.center,
      scrollWheelZoom: true,
      zoom: this.zoom,
      renderer: L.canvas(),
      attributionControl: true,
      layers: [this.original, this.satellite],
    });

    const baseMaps = {
      Satelite: this.satellite,
      Original: this.original,
    };
    L.control.layers(baseMaps).addTo(this.map);
  }
}
