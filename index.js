window.onload = (event) => {
  metricinput = "average precision";
  fetch("./trial_5_model_full_evaluation.json")
        .then((res) => {
        return res.json();
    })
    .then((data) => makeGraph(data))
};
 
function showGraph() {
  var dropdown = document.getElementById("metricdropdown");
  dropdown.addEventListener('change', function (e) {
  metricinput = dropdown.options[dropdown.selectedIndex].value;
    fetch("./trial_5_model_full_evaluation.json")
        .then((res) => {
        return res.json();
    })
    .then((data) => makeGraph(data))
  });
}
function makeGraph(jsonfile) {
  const xdata = [""];
  const ydata = [""];
  var index;
  for (species in jsonfile) {
    //generating x data 
    if (species.indexOf("common") != -1) {
       index = species.indexOf("common");
    } else {
       index = species.indexOf("simple");
    }
    var speciesname = species.slice(0, index-1);
    speciesname = speciesname.replace(/_/g,' ');
    xdata.push(speciesname);
    //generating y axis data
    if (metricinput === "average precision") {
      ydata.push(jsonfile[species]["ap"]);
    }
    if (metricinput === "area under ROC curve") {
      ydata.push(jsonfile[species]["roc_auc"]);
    }
    if (metricinput === "f1 score") {
      ydata.push(jsonfile[species]["f1"]);
    }
    if (metricinput === "false positive rate") {
      ydata.push(jsonfile[species]["false_positive_rate"]);
    }
  }
  console.log(xdata, ydata);
  var data = [{x: xdata, y: ydata, type: 'bar'}];
  Plotly.newPlot('allspeciesmetricgraph', data);
}

  
