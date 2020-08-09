const sensorListElement = document.querySelector('.sensor-list');
var CHARTLIST = {};

document.addEventListener('DOMContentLoaded', () => {
  displayAllDevice(sensorListElement);
  updateData();

  setInterval(() => {
    updateData();
  }, 5000);
});




// API CALLS
async function getDevices(){
  const res = await fetch(
    `${document.location.origin}:5000/device`
  )
  return res.json()
}


async function getMeasurements(){
  const res = await fetch(
    // `${document.location.origin}:5000/record/aggregate?&date_from=${new Date(Date.now() - 3600*24000)}`
    `${document.location.origin}:5000/record/aggregate`
  );
  return res.json();
}





// UI DISPLAY & UPDATE
function displayAllDevice(parentElement){
  CHARTLIST = {};
  getDevices()
  .then((devices) => {
    parentElement.innerHTML = '';
    devices.forEach((device) => {
      const deviceElement = createDeviceUI(device)
      parentElement.appendChild(deviceElement);
    });
  })
  .catch(err => console.log)
}


function updateData(){
  getMeasurements()
  .then((measurementDevices) => {
    measurementDevices.forEach((device) => {

      const deviceElement = document.getElementById(device._id);
      const measurementElement = deviceElement.querySelector('.measurement');
      const levelElement = measurementElement.querySelector('.level > h4');
      const temperatureElement = measurementElement.querySelector('.temperature > h4');
      const humidityElement = measurementElement.querySelector('.humidity > h4');

      const dataList = device.measurement.map((val) => {
        return {
          t: Date.parse(val.timestamp),
          y: val.level
        }
      });

      console.log(dataList)

      // const timestampDataList = device.measurement.map((val) => {
      //   var d = new Date(val.timestamp);
      //   return d.toLocaleString('id-ID',{
      //     dateStyle: 'short',
      //     timeStyle: 'short'
      //   });
      // });

      levelElement.textContent = device.measurement[0].level;
      temperatureElement.textContent = device.measurement[0].temperature;
      humidityElement.textContent = device.measurement[0].humidity; 

      CHARTLIST[device._id].data.datasets[0].data = dataList;
      CHARTLIST[device._id].update();
      
      // changeChartData(CHARTLIST[device._id], timestampDataList, levelDataList)

    });
  })
  .catch(err => console.log(err));
}





// UI FACTORY
function createDeviceUI(device){

  const deviceElement = document.createElement('section');
  deviceElement.className = 'device';
  deviceElement.id = device.mac_address;

  const infoElement = createInfoUI(device);
  const measurementElement = createMeasurementUI();
  const graphElement = createGraphUI(device);

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
  const isOnline = checkOnline(device.last_seen, device.update_time, 1.5);
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
  levelElement.classList.add("level");
  const temperatureElement = createMeasurementPointUI("suhu udara");
  temperatureElement.classList.add("temperature");
  const humidityElement = createMeasurementPointUI("kelembaban");
  humidityElement.classList.add("humidity");


  measurementElement.appendChild(createVSeparatorUI());
  measurementElement.appendChild(levelElement);
  measurementElement.appendChild(createVSeparatorUI());
  measurementElement.appendChild(temperatureElement);
  measurementElement.appendChild(createVSeparatorUI());
  measurementElement.appendChild(humidityElement);
  measurementElement.appendChild(createVSeparatorUI());

  return measurementElement;
}


function createGraphUI(device){
  const graphContainerElement = document.createElement('section');
  graphContainerElement.className = "graph-container";
  const graphElement = document.createElement('canvas');

  graphContainerElement.appendChild(graphElement);

  var chart = new Chart(graphElement.getContext('2d'), {
    type: 'line',
    data: {
      datasets: [{
          data: [{t:0, y:0}],
          type: 'line',
          backgroundColor: 'rgba(99, 99, 255, 0.2)',
          // pointRadius: 0,
          borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      options: {
        scales: {
          xAxes: [{
            type: 'time',
            distribution: 'series',
            offset: true,
            ticks: {
              major: {
                enabled: true,
                fontStyle: 'bold'
              },
              source: 'data',
              autoSkip: true,
              autoSkipPadding: 75,
              maxRotation: 0,
              sampleSize: 100,
            },
            afterBuildTicks: function(scale, ticks){
              console.log(scale, ticks);
              var majorUnit = scale._majorUnit;
							var firstTick = ticks[0];
              var i, ilen, val, tick, currMajor, lastMajor;
              
              val = moment(ticks[0].value);

              if ((majorUnit === 'minute' && val.second() === 0)
                  || (majorUnit === 'hour' && val.minute() === 0)
                  || (majorUnit === 'day' && val.hour() === 9)
                  || (majorUnit === 'month' && val.date() <= 3 && val.isoWeekday() === 1)
                  || (majorUnit === 'year' && val.month() === 0)) {
								firstTick.major = true;
							} else {
								firstTick.major = false;
              }

              lastMajor = val.get(majorUnit);

              for (i = 1, ilen = ticks.length; i < ilen; i++) {
								tick = ticks[i];
								val = moment(tick.value);
								currMajor = val.get(majorUnit);
								tick.major = currMajor !== lastMajor;
								lastMajor = currMajor;
              }
              
              return ticks;
            }
          }],
          yAxes: [{
						gridLines: {
							drawBorder: false
						},
						scaleLabel: {
							display: true,
							labelString: 'Closing price ($)'
						}
					}]
        }
      }
    }
  });

  CHARTLIST[device.mac_address] = chart

  return graphContainerElement;
}


function createVSeparatorUI(){
  const separatorElement = document.createElement("div");
  separatorElement.className = "v-separator";
  return separatorElement;
}


function createHSeparatorUI(){
  const separatorElement = document.createElement("div");
  separatorElement.className = "h-separator";
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





// Logical Operation
function checkOnline(datetime, lifetime, multiplier){
  const lastSeen = new Date(datetime);
  const lastSeenRaw = Math.floor((Date.now() - lastSeen) / 1000);
  return (lastSeenRaw < (lifetime * multiplier));
}

function changeChartData(chart, label, data) {
  chart.data.labels = label;
  chart.data.datasets.forEach((dataset) => {
      dataset.data = data;
  });
  chart.update();
}