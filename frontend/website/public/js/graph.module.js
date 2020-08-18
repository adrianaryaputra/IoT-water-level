var list = {};

// UI FACTORY


function createUI(device){
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
        animation: {
          duration: 0
        },
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
                beginAtZero: true
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

  list[device.mac_address] = chart

  return graphContainerElement;
}


function changeData(mac_address, data) {
  var chart = list[mac_address]; 
  chart.data.datasets[0].data = data;
  chart.update();
}


export var Graph = {
  list,
  createUI,
  changeData,
}