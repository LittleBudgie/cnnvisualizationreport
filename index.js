var speciesinput;

//file split into three main sections: 
// 1. initial loading and creating graphs
// 2. listening functions for dropdowns, etc
// 3. all the functions that create the graphs (plotly.js)

//initial loading and creating graphs
window.onload = (event) => {
  speciesinput = "Amazona autumnalis";
  metricinput = "average precision";
  fetch("./data/trial_5_model_full_evaluation.json")
        .then((res) => {
        return res.json();
    })
    .then((data) => loadAllGraphs(data))
};

function loadAllGraphs(datafile) {
  makeAllSpeciesMetricGraph(datafile);
  specieslist = makePRCurve(datafile);
  makeSpeciesDropdown(datafile, specieslist);
  makeMatrix(datafile);
  loadTrainingCurves();
  loadTrainingDataChart();
}

function loadTrainingDataChart() {
  fetch("./data/pm_jobs.json")
        .then((res) => {
        return res.json();
    })
  .then((data) => makeTrainingDataChart(data))
}

function loadTrainingCurves() {
  fetch("./data/training_curve.json")
        .then((res) => {
        return res.json();
    })
  .then((data) => makeTrainingCurves(data))
}

function makeTrainingCurves(jsonfile) {
  const epochslist = [];
  for (let j = 1; j < 26; j++) {
    epochslist.push(j);
  }
  makeLossGraph(jsonfile, epochslist);
  makeCrossEntropyGraph(jsonfile, epochslist);
}

//listening functions 
function showSpeciesDropdown() {
  var dropdown = document.getElementById("SpeciesDropdown");
  dropdown.addEventListener('change', function (e) {
  speciesinput = dropdown.options[dropdown.selectedIndex].value;
    fetch("./data/trial_5_model_full_evaluation.json")
        .then((res) => {
        return res.json();
    })
    .then((data) => makeMatrix(data))
  }); 
}

function showAllSpeciesMetricGraph() {
  var dropdown = document.getElementById("metricdropdown");
  dropdown.addEventListener('change', function (e) {
  metricinput = dropdown.options[dropdown.selectedIndex].value;
    fetch("./data/trial_5_model_full_evaluation.json")
        .then((res) => {
        return res.json();
    })
    .then((data) => makeAllSpeciesMetricGraph(data))
  });
}


//all make graph functions:

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
  }
  Plotly.newPlot('allspeciesmetricgraph', data, layout);
}

function makePRCurve(jsonfile) {
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
    hovermode: "closest",
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
  return specieslist;
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
}

function makeMatrix(jsonfile) {
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


function makeLossGraph(jsonfile, epochslist) {
  var trace1 = {
    x: epochslist, 
    y: jsonfile['loss'], 
    type: 'scatter',
    name: 'Loss',
    hovertemplate:
            "%{yaxis.title.text}: %{y:.10f}<br>" +
            "%{xaxis.title.text}: %{x}<br>" +
            "<extra></extra>"
  };

  var trace2 = {
    x: epochslist, 
    y: jsonfile['val_loss'], 
    type: 'scatter',
    name: 'Validation Loss',
    hovertemplate:
            "Validation Loss: %{y:.10f}<br>" +
            "%{xaxis.title.text}: %{x}<br>" +
            "<extra></extra>"
  };

  var data = [trace1, trace2];
  
  var layout = {
    title: 'Loss and Validation Loss Over Epochs',
    yaxis: {
      automargin: true,
      title: {
        text: "Loss",
        standoff: 5,
      },
    },
    xaxis: {
      automargin: true,
      title: {
        text: "Training Epochs"
      }
    },
    hovermode: "closest",
  }
  Plotly.newPlot('lossgraph', data, layout);
}

function makeCrossEntropyGraph(jsonfile, epochslist) {
  var trace1 = {
    x: epochslist, 
    y: jsonfile['masked_binary_crossentropy'], 
    type: 'scatter',
    name: 'Masked Binary Cross Entropy',
    hovertemplate:
            "Masked Binary Cross Entropy: %{y:.10f}<br>" +
            "%{xaxis.title.text}: %{x}<br>" +
            "<extra></extra>"
  };

  var trace2 = {
    x: epochslist, 
    y: jsonfile['val_masked_binary_crossentropy'], 
    type: 'scatter',
    name: 'Validation Masked Binary Cross Entropy',
    hovertemplate:
            "Validation Masked Binary Cross Entropy: %{y:.10f}<br>" +
            "%{xaxis.title.text}: %{x}<br>" +
            "<extra></extra>"
  };

  var data = [trace1, trace2];
  
  var layout = {
    title: 'Masked Binary Cross Entropy & Validation Masked Binary Cross Entropy Over Epochs',
    yaxis: {
      automargin: true,
      title: {
        text: "Cross Entropy",
        standoff: 5,
      },
    },
    xaxis: {
      automargin: true,
      title: {
        text: "Training Epochs"
      }
    },
    hovermode: "closest",
  }
  Plotly.newPlot('crossentropygraph', data, layout);
}

function makeTrainingDataChart(jsonfile) {
  const presencedata = [];
  const absencedata = [];
  const specieslist = [];
  const totallist = [];
  for (species in jsonfile) {
    presencedata.push(jsonfile[species]['#Present']);
    absencedata.push(jsonfile[species]['#Absent']);
    specieslist.push(species);
    totallist.push(jsonfile[species]['#Present'] + jsonfile[species]['#Absent']);
  }

  var totaldata = {};
  specieslist.forEach((key, i) => totaldata[key] = totallist[i]);
  console.log(totaldata);


  var trace1 = {
    x: specieslist,
    y: absencedata,
    type: 'bar',
    name: 'Absence',
    hovertemplate:
            "Species: %{x}<br>" +
            "Absence Data: %{y}<br>" +
            "<extra></extra>"
  };
  var trace2 = {
    x: specieslist,
    y: presencedata,
    type: 'bar',
    name: 'Presence',
    hovertemplate:
            "Species: %{x}<br>" +
            "Absence Data: %{y}<br>" +
            "<extra></extra>"
  };
  var data = [trace1, trace2];

  
  var layout = {
    barmode: 'stack',
    title: 'Training Data Used for Each Species, Separated by Presence/Absence Data',
    yaxis: {
      automargin: true,
      title: {
        text: "Amount of Recordings",
        standoff: 10,
      },
    },
    xaxis: {
      automargin: true,
      tickangle: 45,
      title: {
        text: "Species",
        standoff: 5,
      }
    },
  };
  Plotly.newPlot('trainingdatachart', data, layout);
}