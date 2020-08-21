import {Device, Measurement} from './device.module.js';
import {Graph} from './graph.module.js';
import {Param} from './params.module.js';

const sensorListElement = document.querySelector('.sensor-list');
const addHolderElement = document.querySelector('.add-device-holder');
const urlParams = new URLSearchParams(window.location.search);



// event listener
document.addEventListener('DOMContentLoaded', () => {
  displayAllDevice(sensorListElement);
  updateData();

  // search add parameter
  var URLParAdd = urlParams.get('add');

  // if add parameter exist
  if(URLParAdd != null){
    
    // check if device exist
    Device.GET_ONE(URLParAdd)
    .then((arr) => {
      // if not exist show add device
      if(arr.length == 0){
        showAdd();
      // if exist go to device setting
      } else {
        window.location = `${location.origin}/device/?mac=${URLParAdd}`
      }
    })
    .catch((err) => {
      window.location = location.href;
    });

  }
});

addHolderElement
.querySelector('.cancel')
.addEventListener('click', showAdd);

addHolderElement
.querySelector('.submit')
.addEventListener('click', getAddForm);

addHolderElement
.querySelector('.add-device-outer')
.addEventListener('click', showAdd);



// Show & Hide Add Device UI

function showAdd(){

  var mac_addr = urlParams.get('add');
  const formElement = addHolderElement.querySelector('form');
  formElement.querySelector('.submit').textContent = 'Submit';
  
  formElement.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  formElement.addEventListener('input', (evt)=>{
    checkAddForm();
  });
  
  if(mac_addr == null || mac_addr == undefined) mac_addr = '';
  addHolderElement.querySelector('#add_mac_address').value = mac_addr;

  if(addHolderElement.style.display == 'none'){
    addHolderElement.style.display = 'block';
  }
  else{
    addHolderElement.style.display = 'none';
  }

  checkAddForm();
}


function checkAddForm(){
  var notValid = false;
  const formElement = addHolderElement.querySelector('form');
  const submitBtnElement = formElement.querySelector('.submit');
  const formData = new FormData(formElement);
  const mac_address = formData.get('add_mac_address');
  const name = formData.get('add_name');
  const lifetime = formData.get('add_lifetime');
  const pipe_length = formData.get("add_pipe_length");

  if(mac_address.match(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/gi) == null){
    notValid = notValid || true;
  }

  if(name.match(/^[\w\s]{1,21}$/gi) == null){
    notValid = notValid || true
  }

  var lifetime_num = parseInt(lifetime)
  if(isNaN(lifetime_num)){
    notValid = notValid || true
  }

  var pipe_length_num = parseInt(pipe_length)
  if(isNaN(pipe_length_num)){
    notValid = notValid || true
  }

  submitBtnElement.disabled =  notValid;
}


function getAddForm(){

  const formElement = addHolderElement.querySelector('form');
  const formData = new FormData(formElement);
  formElement.querySelector('.submit').disabled = true;
  formElement.querySelector('.submit').textContent = 'Submitting ...';
  
  var body = {
    mac_address: formData.get('add_mac_address'),
    name: formData.get('add_name'),
    update_time: parseInt(formData.get('add_lifetime'))
    // pipe_length: parseInt(formData.get("add_pipe_length"))
  };

  Device.POST(body)
  .then(() => {
    window.location = document.location.origin;
  })
  .catch((err) => {
    formElement.querySelector('.submit').textContent = 'Failed to Submit';
  });

}


// UI DISPLAY & UPDATE
function displayAllDevice(parentElement){
  Device.GET()
  .then((devices) => {
    parentElement.innerHTML = '';
    var addDeviceElement = document.createElement('p');
    addDeviceElement.className = 'add-device-btn';
    addDeviceElement.textContent = 'Add Device';
    addDeviceElement.addEventListener('click', ()=>{
      showAdd();
    });
    parentElement.appendChild(addDeviceElement);

    devices.forEach((device) => {
      const deviceElement = Device.createUI(device)
      deviceElement.addEventListener('click', () => {
        window.location = `${location.origin}/device/?mac=${device.mac_address}`
      });
      parentElement.appendChild(deviceElement);
    });

  })
  .catch(err => console.log(err))
}


function updateData(){
  Measurement.GET()
  .then((measurementDevices) => {
    measurementDevices.forEach((device) => {

      const deviceElement = document.getElementById(device._id);

      if(deviceElement){
        const infoElement = deviceElement.querySelector('.info');
        const nameElement = infoElement.querySelector('h3');

        const measurementElement = deviceElement.querySelector('.measurement');
        const levelElement = measurementElement.querySelector('.level > h4');
        const levelAlarmElement = measurementElement.querySelector('.level > .level-alarm');
        const temperatureElement = measurementElement.querySelector('.temperature > h4');
        const humidityElement = measurementElement.querySelector('.humidity > h4');
        const sensorStatusElement = deviceElement.querySelector('.info > h5');

        const dataList = device.measurement.map((val) => {
          return {
            y: parseFloat(val.level).toFixed(2),
            t: new Date(val.timestamp)
          };
        });

        nameElement.textContent = device.name;
        const currLevel = parseFloat(device.measurement[0].level).toFixed(2);
        levelElement.textContent = currLevel;
        const alarmResult = Device.checkLevelAlarm(currLevel, device.alarm);
        if(alarmResult === undefined){
          levelAlarmElement.style.display = "none";
        } else {
          levelAlarmElement.style.display = "block";
          levelAlarmElement.textContent = alarmResult.message;
          levelAlarmElement.className = `level-alarm ${alarmResult.class}`;
        }

        temperatureElement.textContent = parseFloat(device.measurement[0].temperature).toFixed(2);
        humidityElement.textContent = parseFloat(device.measurement[0].humidity).toFixed(2);

        const isOnline = Device.checkOnline(device.last_seen, device.update_time);
        sensorStatusElement.textContent = isOnline ? "ONLINE" : "OFFLINE";
        sensorStatusElement.className = isOnline ? "status-normal" : "status-danger"
        
        Graph.changeData(device._id, dataList);
      }
      else{
        // console.error("cannot find device :", device._id, device)
        displayAllDevice(sensorListElement);
      }

    });
    setTimeout(() => {updateData()}, 1000);

  })
  .catch(err => {

    console.log(err)
    setTimeout(() => {updateData()}, 1000);

  });
}





