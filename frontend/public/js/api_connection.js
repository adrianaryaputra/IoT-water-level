sensorListElement = document.querySelector('.sensor-list');

document.addEventListener('DOMContentLoaded', () => {
  listAllDevice(sensorListElement);
  setInterval(() => {
    listAllDevice(sensorListElement);
  }, 5000);
});

async function getDevice(){
  const res = await fetch(
    `${document.location.origin}:5000/device`
  );
  return res.json();
}

async function getMeasurement(mac_address){
  const res = await fetch(
    `${document.location.origin}:5000/record?mac_address=${mac_address}`
  );
  return res.json();
}

function checkOnline(datetime, lifetime, multiplier){
  lastSeen = new Date(datetime);
  lastSeenRaw = Math.floor((Date.now() - lastSeen) / 1000);
  return (lastSeenRaw < (lifetime * multiplier));
}

function createDevice(device){
  const div = document.createElement('div');

  const name = document.createElement('h3');
  name.textContent = device.name;

  const mac_address = document.createElement('h5');
  mac_address.textContent = device.mac_address;

  const status = document.createElement('p');
  status.textContent = checkOnline(
    device.last_seen,
    device.update_time,
    1.5) ? "ONLINE" : "OFFLINE"

  div.appendChild(name);
  div.appendChild(mac_address);
  div.appendChild(status);

  return div;
}

function listAllDevice(parentElement){
  getDevice()
  .then((devices) => {
    parentElement.innerHTML = '';
    devices.forEach((device) => {

      deviceElement = createDevice(device)
      parentElement.appendChild(deviceElement);

    });
  })
  .catch(err => console.log)
}