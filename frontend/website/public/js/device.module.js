import {Graph} from './graph.module.js'
import {Param} from './params.module.js'

// UI Factory
function createUI(device){

  const deviceElement = document.createElement('section');
  deviceElement.className = 'device';
  deviceElement.id = device.mac_address;

  const infoElement = createInfoUI(device);
  const measurementElement = createMeasurementUI();
  const graphElement = Graph.createUI(device);

  deviceElement.appendChild(infoElement);
  deviceElement.appendChild(measurementElement);
  deviceElement.appendChild(graphElement);

  return deviceElement;
}


function createInfoUI(device){
  const infoElement = document.createElement('div');
  infoElement.className = "info"

  const nameElement = document.createElement('h3');
  nameElement.textContent = device.name;

  const macElement = document.createElement('h4');
  macElement.textContent = device.mac_address;

  const statusElement = document.createElement('h5');
  const isOnline = checkOnline(device.last_seen, device.update_time);
  statusElement.textContent = isOnline ? "ONLINE" : "OFFLINE";
  statusElement.className = isOnline ? "status-normal" : "status-danger"

  infoElement.appendChild(nameElement);
  infoElement.appendChild(macElement);
  infoElement.appendChild(statusElement);

  return infoElement;
}


function createMeasurementUI(){
  const measurementElement = document.createElement('div');
  measurementElement.className = "measurement";

  const levelElement = createMeasurementPointUI("ketinggian air");
  const levelAlarmElement = document.createElement('h5');
  levelAlarmElement.textContent = "###";
  levelAlarmElement.className = "level-alarm status-danger";
  levelAlarmElement.style.display = "none";
  levelElement.appendChild(levelAlarmElement);
  levelElement.classList.add("level");
  const temperatureElement = createMeasurementPointUI("suhu udara");
  temperatureElement.classList.add("temperature");
  const humidityElement = createMeasurementPointUI("kelembaban");
  humidityElement.classList.add("humidity");


  measurementElement.appendChild(createSeparatorUI());
  measurementElement.appendChild(levelElement);
  measurementElement.appendChild(createSeparatorUI());
  measurementElement.appendChild(temperatureElement);
  measurementElement.appendChild(createSeparatorUI());
  measurementElement.appendChild(humidityElement);
  measurementElement.appendChild(createSeparatorUI());

  return measurementElement;
}


function createSeparatorUI(){
  const separatorElement = document.createElement("div");
  separatorElement.className = "separator";
  return separatorElement;
}


function createMeasurementPointUI(title){
  const pointElement = document.createElement('div');
  pointElement.className = "point";

  const pointTitleElement = document.createElement('h3');
  pointTitleElement.textContent = title;

  const pointValueElement = document.createElement('h4');
  pointValueElement.textContent = "#";

  pointElement.appendChild(pointTitleElement);
  pointElement.appendChild(pointValueElement);

  return pointElement;
}





// API Method
async function deviceGet(){
  const res = await fetch(
    `${document.location.origin}:5000/device`
  )
  return res.json();
}


async function deviceGetOne(mac_address){
  const res = await fetch(
    `${document.location.origin}:5000/device?mac_address=${mac_address}`
  );
  return res.json();
}


async function devicePost(body){
  const res = await fetch(
    `${document.location.origin}:5000/device`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  return res.json();
}


async function devicePut(body){
  const res = await fetch(
    `${document.location.origin}:5000/device`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  return res;
}


async function measurementsGet(){
  const res = await fetch(
    `${document.location.origin}:5000/record/aggregate?limit=${Param.AGGREGATE_LIMIT}`
  );
  return res.json();
}


async function measurementGetOne(mac_address){
  const res = await fetch(
    `${document.location.origin}:5000/record?mac_address=${mac_address}&limit=${Param.AGGREGATE_LIMIT}`
  );
  return res.json();
}





// Calculation
function checkOnline(datetime, lifetime){
  const lastSeen = new Date(datetime);
  const lastSeenRaw = Math.floor((Date.now() - lastSeen) / 1000);
  return (lastSeenRaw < (lifetime + Param.DEVICE_INACTIVE_AFTER));
}

function checkLevelAlarm(level, alarm){
  if(alarm === undefined || alarm === null){
    return;
  } else {
    switch(true){
      case level > alarm.evakuasi:
        return {message: "Evakuasi", class: "status-danger"}; break;
      case level > alarm.siaga1:
        return {message: "Siaga 1", class: "status-warning"}; break;
      case level > alarm.siaga2:
        return {message: "Siaga 2", class: "status-warning"}; break;
      case level > alarm.siaga3:
        return {message: "Siaga 3", class: "status-warning"}; break;
      case level > alarm.siaga4:
        return {message: "Siaga 4", class: "status-warning"}; break;
      default:
        return {message: "Normal", class: "status-normal"}; break;
    }
  }
}

export var Device = {
  createUI,
  checkOnline,
  checkLevelAlarm,
  GET: deviceGet,
  GET_ONE: deviceGetOne,
  POST: devicePost,
  PUT: devicePut,
}

export var Measurement = {
  GET: measurementsGet,
  GET_ONE: measurementGetOne,
}