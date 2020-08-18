import {Graph} from '../js/graph.module.js';
import {Device, Measurement} from '../js/device.module.js';

const urlParams = new URLSearchParams(window.location.search);

const formElement = document.querySelector('form');
const graphElement = document.querySelector('.graph');

const form = {
  measurement: {
    level: formElement.querySelector('#level'),
    temperature: formElement.querySelector('#temperature'),
    humidity: formElement.querySelector('#humidity'),
  },
  device: {
    status: formElement.querySelector('#status'),
    mac_address: formElement.querySelector('#mac_address'),
    name: formElement.querySelector('#name'),
    lifetime: formElement.querySelector('#lifetime'),
    pipe_length: formElement.querySelector('#pipe_length'),
    last_update: formElement.querySelector('#last_update'),
  },
  alarm: {
    siaga1: formElement.querySelector('#siaga1'),
    siaga2: formElement.querySelector('#siaga2'),
    siaga3: formElement.querySelector('#siaga3'),
    siaga4: formElement.querySelector('#siaga4'),
    evakuasi: formElement.querySelector('#evakuasi'),
  },
  status: {
    viewer: formElement.querySelector('#error-viewer'),
  },
  button: {
    submit: formElement.querySelector('.submit'),
    cancel: formElement.querySelector('.cancel'),
  },
}



document.addEventListener('DOMContentLoaded', () => {
  // get URL Parameter mac_address
  var URLParMac = urlParams.get('mac');
  if(URLParMac != null){
    console.log(URLParMac);
    getDevice(URLParMac);
  } else {
    window.location = location.origin;
  }
});

formElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
});

form.button.cancel.addEventListener('click', () => {
  window.location = location.origin;
});

form.button.submit.addEventListener('click', () => {
  // window.location = window.location;
  // form.error.viewer.style.display = "block"
  Device.PUT({
    mac_address: form.device.mac_address.textContent,
    name: form.device.name.value,
    update_time: form.device.lifetime.value,
    pipe_length: form.device.pipe_length.value,
    alarm: {
      siaga4: form.alarm.siaga4.value,
      siaga3: form.alarm.siaga3.value,
      siaga2: form.alarm.siaga2.value,
      siaga1: form.alarm.siaga1.value,
      evakuasi: form.alarm.evakuasi.value,
    },
  })
  .then((res) => {
    if(res.status == 200){
      form.status.viewer.style.backgroundColor = "var(--color-state-normal)";
      form.status.viewer.style.display = "block";
      form.status.viewer.textContent = "Update Success ..."
      setTimeout(()=>{
        form.status.viewer.style.display = "none";
      }, 3000)
    } 
    else if(res.status == 422) {
      throw Error('invalid data');
    }
    else{
      throw Error(res.statusText);
    }
  })
  .catch((err) => {
    form.status.viewer.style.display = "block";
    form.status.viewer.textContent = err;
    setTimeout(()=>{
      form.status.viewer.style.display = "none";
    }, 3000)
  })
});

function getDevice(mac_address){
  Device.GET_ONE(mac_address)
  .then((device) => {
    device = device[0];
    form.device.mac_address.textContent = device.mac_address;
    form.device.name.value = device.name;
    form.device.lifetime.value = device.update_time;
    form.device.pipe_length.value = device.pipe_length;
    var lastUpdate = new Date(device.last_seen)
    form.device.last_update.textContent = lastUpdate.toLocaleString('id-ID');

    if(device.alarm){
      form.alarm.siaga1.value = device.alarm.siaga1;
      form.alarm.siaga2.value = device.alarm.siaga2;
      form.alarm.siaga3.value = device.alarm.siaga3;
      form.alarm.siaga4.value = device.alarm.siaga4;
      form.alarm.evakuasi.value = device.alarm.evakuasi;
    } else {
      form.alarm.siaga1.value = device.pipe_length;
      form.alarm.siaga2.value = device.pipe_length;
      form.alarm.siaga3.value = device.pipe_length;
      form.alarm.siaga4.value = device.pipe_length;
      form.alarm.evakuasi.value = device.pipe_length;
    }

    const isOnline = Device.checkOnline(device.last_seen, device.update_time);
    form.device.status.textContent = isOnline? "ONLINE" : "OFFLINE";
    form.device.status.style.backgroundColor = isOnline ? "var(--color-state-normal)" : "var(--color-state-danger)"

    graphElement.appendChild(Graph.createUI(device));

    formElement.querySelector('.submit').disabled = false;

    getMeasurement(mac_address);

  })
  .catch(err => console.log(err));
}

function getMeasurement(mac_address){

  Measurement.GET_ONE(mac_address)
  .then((measurement) => {

    const lastMeasurement = measurement[0].measurement;

    form.measurement.level.textContent = lastMeasurement.level;
    form.measurement.temperature.textContent = lastMeasurement.temperature;
    form.measurement.humidity.textContent = lastMeasurement.humidity;

    const dataList = measurement.map((val) => {
      return {
        y: parseFloat(val.measurement.level).toFixed(2),
        t: new Date(val.timestamp)
      };
    });

    Graph.changeData(mac_address, dataList)

    setTimeout(() => {
      getMeasurement(mac_address);
    },1000);

  })
}