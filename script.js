var myBarChart;
var controls = function() {
  this.A = 0;
  this.B = 0;
  this.OXsym = false;
  this.OYsym = false;
  this.OXabs = false;
  this.OYabs = false;
};
window.onload = function() {
  var ctrls = new controls();
  var gui = new dat.GUI({width:window.innerWidth-20,autoPlace:false});
  var a=gui.add(ctrls, 'A', -10, 10).step(1).name("Zmienna A <--prawo lewo-->");
  var b=gui.add(ctrls, 'B', -10, 10).step(1).name("Zmienna B <--dół góra-->");
  var ox = gui.add(ctrls, 'OXsym').name("Symetria względem OX");
  var oy = gui.add(ctrls, 'OYsym').name("Symetria względem OY");
  var oxabs = gui.add(ctrls, 'OXabs').name("Odbicie wartości ujemnych względem OX");
  var oyabs = gui.add(ctrls, 'OYabs').name("Odbicie wartości ujemnych względem OY");
  a.onChange(function(value) {
  draw(ctrls);
});
  b.onChange(function(value) {
  draw(ctrls);
});
  ox.onChange(function(value){
  	draw(ctrls);
  });
  oy.onChange(function(value){
  	draw(ctrls);
  });
  oxabs.onChange(function(value){
  	draw(ctrls);
  });
  oyabs.onChange(function(value){
  	draw(ctrls);
  });
  draw(ctrls);
  document.getElementById("controls").appendChild(gui.domElement);
};
function mayBeAbs(param,flag){
  if(flag)
    return Math.abs(param);
  return param;
}
function draw(c){
  try{
  myBarChart.destroy();
}catch(Error){};
var ctx = document.getElementById("myChart");
var data = {
	labels: [-10, -9, -8, -7, -6,-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    datasets: [
    {
        label: `f(x) = x³`,
        function: function(x) { return Math.pow(x,3) },
        borderColor: "rgba(255, 192, 192, 1)",
        data: [],
        fill: false
    },
    {
        label: `g(x) = ${c.OXabs?"|":""}${c.OXsym?"-":""}((${c.OYabs?"|":""}${c.OYsym?"-":""}x+${c.A}${c.OYabs?"|":""})³+${c.B})${c.OXabs?"|":""}`,
        function: function(x) {
        	return mayBeAbs((c.OXsym?-1:1)*(Math.pow(mayBeAbs((c.OYsym?-1:1)*x+c.A,c.OYabs),3)+c.B),c.OXabs);
        },
        borderColor: "rgba(75, 192, 192, 1)",
        data: [],
        fill: false
    }]
};
Chart.pluginService.register({
    beforeInit: function(chart) {
        var data = chart.config.data;
        for (var i = 0; i < data.datasets.length; i++) {
            for (var j = 0; j < data.labels.length; j++) {
            	var fct = data.datasets[i].function,
                	x = data.labels[j],
                	y = fct(x);
                data.datasets[i].data.push(y);
            }
        }
    }
});
Chart.scaleService.updateScaleDefaults('linear', {
    ticks: {
        min: -50,
        max: 50
    }
});
myBarChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
    	responsive: true,
      aspectRatio: 3,
    	animation: {
        duration: 0
    	},
      legend:{
        labels:{
          fontSize: 20
        }
      }
    }
});
}