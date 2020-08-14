const sensorListElement = document.querySelector('.sensor-list');
var CHARTLIST = {};

document.addEventListener('DOMContentLoaded', () => {
  displayAllDevice(sensorListElement);
  updateData();
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
    `${document.location.origin}:5000/record/aggregate?limit=20`
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

      if(deviceElement){
        const infoElement = deviceElement.querySelector('.info');
        const nameElement = infoElement.querySelector('h3');

        const measurementElement = deviceElement.querySelector('.measurement');
        const levelElement = measurementElement.querySelector('.level > h4');
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

        levelElement.textContent = parseFloat(device.measurement[0].level).toFixed(2);
        temperatureElement.textContent = parseFloat(device.measurement[0].temperature).toFixed(2);
        humidityElement.textContent = parseFloat(device.measurement[0].humidity).toFixed(2);

        const isOnline = checkOnline(device.last_seen, device.update_time, 1.5);
        sensorStatusElement.textContent = isOnline ? "ONLINE" : "OFFLINE";
        sensorStatusElement.className = isOnline ? "status-normal" : "status-danger"
        
        CHARTLIST[device._id].data.datasets[0].data = dataList;
        CHARTLIST[device._id].update();
      }
      else{
        console.error("cannot find device :", device._id, device)
        displayAllDevice(sensorListElement);
      }

    });
    console.log('GET');
    setTimeout(() => {updateData()}, 1000);

  })
  .catch(err => {

    console.log(err)
    setTimeout(() => {updateData()}, 1000);

  });
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


  measurementElement.appendChild(createSeparatorUI());
  measurementElement.appendChild(levelElement);
  measurementElement.appendChild(createSeparatorUI());
  measurementElement.appendChild(temperatureElement);
  measurementElement.appendChild(createSeparatorUI());
  measurementElement.appendChild(humidityElement);
  measurementElement.appendChild(createSeparatorUI());

  return measurementElement;
}


function createGraphUI(device){
  const graphContainerElement = document.createElement('section');
  graphContainerElement.className = "graph-container";
  const graphElement = document.createElement('canvas');

  graphContainerElement.appendChild(graphElement);

  const darkmode = window.matchMedia('(prefers-color-scheme: dark)');
  const colorscheme = {
    bgColor: 'hsla(210, 64%, 31%, 0.2)',//'rgba(28, 78, 128, 0.2)',
    borderColor: 'hsla(210, 64%, 31%, 0.9)',
    lineColor: 'hsla(0, 0%, 13%, 0.15)'
  }

  if(darkmode.matches){
    colorscheme.bgColor = 'hsla(210, 64%, 81%, 0.2)'; //'rgba(155, 205, 255, 0.2)';
    colorscheme.borderColor = 'hsla(210, 64%, 81%, 0.9)';
    colorscheme.lineColor = 'hsla(0, 0%, 95%, 0.15)';
  }

  try{
    Chart.defaults.global.defaultColor = colorscheme.lineColor;
    Chart.defaults.global.defaultFontColor = colorscheme.borderColor;
    var chart = new Chart(graphElement.getContext('2d'), {
      type: 'line',
      data: {
          labels: [],
          datasets: [{
              label: null,
              data: [],
              backgroundColor: colorscheme.bgColor,
              borderColor: colorscheme.borderColor,
              borderWidth: 1
          }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            gridLines: {
              color: colorscheme.lineColor
            },
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
            time: {
              displayFormats: {
                millisecond: 'kk:mm:ss.SS',
                second: 'ddd kk:mm:ss',
                minute: 'ddd kk:mm',
                hour: 'ddd kk:mm',
                day: 'ddd DD',
                week: 'DD MMM',
                month: 'MMM YY',
                quarter: 'MMM YY',
                year: 'MMM YY',
              }
            }
          }],
          yAxes: [{
            gridLines: {
              color: colorscheme.lineColor,
							drawBorder: false
            },
            scaleLabel: {
							display: true,
							labelString: 'meter'
						},
            ticks: {
                beginAtZero: false
            }
          }]
        },
        legend: {display: false},
        tooltips:{
          intersect: false,
          mode: 'index'
        }
      }
    });
  } catch(err) {
    console.log(err)
  }

  CHARTLIST[device.mac_address] = chart

  return graphContainerElement;
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