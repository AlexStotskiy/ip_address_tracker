import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {addOffset, validateIp, addTileLayer} from './helpers';
import icon from '../images/icon-location.svg';

const ipInput = document.querySelector('.search-bar__input');
const btn = document.querySelector('.search-bar__btn');

const ipInfo = document.getElementById('ip');
const locationInfo = document.getElementById('location');
const timezoneInfo = document.getElementById('timezone');
const ispInfo = document.getElementById('isp');

btn.addEventListener('click', () => getData());
ipInput.addEventListener('keydown', handleKey); 

const markerIcon = L.icon({
    iconUrl: icon,
    iconSize: [30, 40],
});
const mapArea = document.querySelector('.map');
let mapLayerNotAdded = 1;
let map = {};
document.addEventListener('DOMContentLoaded', () => {fetch('https://api.ipify.org?format=json').then(resp => resp.json()).then((json) => getData(json.ip))});

function getData(ipAddr = ipInput.value) {
    if (ipInput.value) mapLayerNotAdded = 0;
    if (validateIp(ipAddr)) {
        fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=<your_apiKey>&ipAddress=${ipAddr}`) // Your must get the apiKey on https://geo.ipify.org/
        .then(response => response.json())
        .then(setInfo);
    }
}

function handleKey(ev) {
    if (ev.key === 'Enter') {
        getData();
    }
}

function setInfo(mapData) {
    const {country, region, city, timezone, lat, lng} = mapData.location;
    ipInfo.innerText = mapData.ip;
    locationInfo.innerText = country + ' ' + region + ', ' + city;
    timezoneInfo.innerText = timezone;
    ispInfo.innerText = mapData.isp;
    if (mapLayerNotAdded) {
        map = L.map(mapArea).setView([lat, lng], 13);
        addTileLayer(map);
    } else {
        map.setView([lat, lng]);
    }
    L.marker([lat, lng], {icon: markerIcon}).addTo(map);
    if (matchMedia("(max-width: 1023px)").matches) {
        addOffset(map);
    }
}
