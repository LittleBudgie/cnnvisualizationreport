var speciesinput;

window.onload = (event) => {
  speciesinput = "Amazona autumnalis";
  metricinput = "average precision";
  fetch("./trial_5_model_full_evaluation.json")
        .then((res) => {
        return res.json();
    })
    .then((data) => makeAllSpeciesMetricGraph(data))
};

function showSpeciesDropdown() {
  var dropdown = document.getElementById("SpeciesDropdown");
  dropdown.addEventListener('change', function (e) {
  speciesinput = dropdown.options[dropdown.selectedIndex].value;
    fetch("./trial_5_model_full_evaluation.json")
        .then((res) => {
        return res.json();
    })
    .then((data) => createMatrix(data))
  }); 
}
 //allspeciesmetricgraph
function showAllSpeciesMetricGraph() {
  var dropdown = document.getElementById("metricdropdown");
  dropdown.addEventListener('change', function (e) {
  metricinput = dropdown.options[dropdown.selectedIndex].value;
    fetch("./trial_5_model_full_evaluation.json")
        .then((res) => {
        return res.json();
    })
    .then((data) => makeAllSpeciesMetricGraph(data))
  });
}
function makeAllSpeciesMetricGraph(jsonfile) {
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
  //creating plot
  var data = 
    [{x: xdata, y: ydata, type: 'scatter',
      mode: 'markers', 
    }];
  var layout = {
    title: metricinput + ' across species',
    yaxis: {
      automargin: true,
      title: {
        text: metricinput + " values"
      }
    },
    xaxis: {
      automargin: true,
    },
    margin: {

    }
  }
  Plotly.newPlot('allspeciesmetricgraph', data, layout);
  makeCurve(jsonfile);
}

function makeCurve(jsonfile) {
  const precision = [""];
  const recall = [""];
  const specieslist = [""];
  for (species in jsonfile) {
    //generating specieslist
    if (species.indexOf("common") != -1) {
       index = species.indexOf("common");
    } else {
       index = species.indexOf("simple");
    }
    var speciesname = species.slice(0, index-1);
    speciesname = speciesname.replace(/_/g,' ');
    specieslist.push(speciesname);
    //generating y axis data
    precision.push(jsonfile[species]["precision"]);
    recall.push(jsonfile[species]["recall"]);
    }
  //creating plot
  var data = 
    [{x: recall, y: precision, type: 'scatter',
      text: specieslist,
      mode: 'markers', 
    }];
  var layout = {
    title: 'precision-recall curve across species',
    yaxis: {
      automargin: true,
      title: {
        text: "Precision"
      }
    },
    xaxis: {
      automargin: true,
      title: {
        text: "Recall"
      }
    },
  }
  Plotly.newPlot('precisionrecallcurve', data, layout);
  makeSpeciesDropdown(jsonfile, specieslist);
}

function makeSpeciesDropdown(jsonfile, specieslist) {
  specieslist.sort();
  var i;
    for (i = 2; i < specieslist.length; i++) {
      //start at i = 2 because we already have the first species in the dropdown 
      // also becuase first item in list is blank
      if (document.getElementsByClassName("dropdownspecies").length != 97) {
        var node = document.createElement('option');
        node.classList.add("dropdownspecies");
        node.appendChild(document.createTextNode(specieslist[i]));
        document.querySelector('#SpeciesDropdown').appendChild(node);
      }
  }
  createMatrix(jsonfile);
}

function createMatrix(jsonfile) {
  const speciesinputarr = speciesinput.split(" ");
  const speciesnamearr = [""];
  for (i = 0; i < speciesinputarr.length; i++) {
    speciesnamearr.push(speciesinputarr[i], "_");
  }
  if (speciesnamearr.join("").includes("Pionus_menstruus")) {
    speciesnamearr.push("simple_call");
  } else if (speciesnamearr.join("").includes("Turdus_albicollis")) {
    speciesnamearr.push("simple_call");
  } else {
    speciesnamearr.push("common_song");
  }
  speciesname = speciesnamearr.join("");
  const speciesrow = jsonfile[speciesname];
  var a, b, c, d;
  b = parseFloat(speciesrow.false_positive_rate) * speciesrow.true_absence;
  b = Math.round(b);
  d = speciesrow.true_absence - b;
  a = speciesrow.predicted_presence - b;
  c = speciesrow.predicted_absence - d;
  
  var data = [{
        z: [[c, d], 
            [a, b]],
        type: 'heatmap', 
        colorscale: [
          ['0.0', 'rgb(165,0,38)'],
          ['0.111111111111', 'rgb(215,48,39)'],
          ['0.222222222222', 'rgb(244,109,67)'],
          ['0.333333333333', 'rgb(253,174,97)'],
          ['0.444444444444', 'rgb(254,224,144)'],
          ['0.555555555556', 'rgb(224,243,248)'],
          ['0.666666666667', 'rgb(171,217,233)'],
          ['0.777777777778', 'rgb(116,173,209)'],
          ['0.888888888889', 'rgb(69,117,180)'],
          ['1.0', 'rgb(49,54,149)']
        ],
        x: [speciesinput, 'Not ' + speciesinput],
        y: ['Not ' + speciesinput, speciesinput],
      }];
  var layout = {
    title: 'Confusion Matrix for ' + speciesinput,
    annotations: [
      {
        font: {
          size: 20,
          color: "white",
        },
        showarrow: false,
        text: c,
        x: speciesinput,
        y: 'Not ' + speciesinput,
      }, 
      {
        font: {
          size: 20,
          color: "white",
        },
        showarrow: false,
        text: d,
        x: 'Not ' + speciesinput,
        y: 'Not ' + speciesinput,
      },
      {
        font: {
          size: 20,
          color: "white",
        },
        showarrow: false,
        text: b,
        x: 'Not ' + speciesinput,
        y: speciesinput,
      },
      {
        font: {
          size: 20,
          color: "white",
        },
        showarrow: false,
        text: a,
        x: speciesinput,
        y: speciesinput,
      }
    ],
    yaxis: {
      automargin: true,
      title: {
        text: "Prediction"
      }
    },
    xaxis: {
      automargin: true,
      title: {
        text: "Actual"
      }
    },
  };
  Plotly.newPlot('confusionmatrix', data, layout);
}
