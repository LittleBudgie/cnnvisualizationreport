const specieslist = ['Formicarius analis',
 'Herpsilochmus dorsimaculatus',
 'Dendrocolaptes certhia',
 'Myrmoderus ferrugineus',
 'Crypturellus variegatus',
 'Ramphotrigon ruficauda',
 'Ramphastos tucanus',
 'Vireolanius leucotis',
 'Lipaugus vociferans',
 'Frederickena viridis',
 'Thamnophilus murinus',
 'Formicarius colma',
 'Piprites chloris',
 'Patagioenas plumbea',
 'Crypturellus soui',
 'Willisornis poecilinotus',
 'Ramphocaenus melanurus',
 'Trogon viridis',
 'Nyctidromus albicollis',
 'Attila spadiceus',
 'Myrmothera campanisona',
 'Hypocnemis cantator',
 'Percnostola rufifrons subcristata',
 'Pithys albifrons',
 'Leucopternis melanops',
 'Monasa atra',
 'Mionectes macconneli',
 'Psarocolius viridis',
 'Micrastur gilvicollis',
 'Cercomacra cinerascens',
 'Pitangus sulphuratus',
 'Ortalis motmot',
 'Tinamus major',
 'Turdus albicollis',
 'Brotogeris chrysoptera',
 'Pionus menstruus',
 'Pionus fuscus',
 'Amazona autumnalis',
 'Deroptyus accipitrinus',
 'Megascops watsonii',
 'Myrmelastes leucostigma',
 'Patagioenas speciosa',
 'Glaucidium hardyi',
 'Cyanoloxia rothschildii',
 'Nyctibius griseus',
 'Trogon rufus',
 'Trogon violaceus',
 'Momotus momota',
 'Selenidera piperivora',
 'Ramphastos vitellinus',
 'Piculus chrysochloros',
 'Celeus undatus',
 'Galbula albirostris',
 'Jacamerops aureus',
 'Bucco tamatia',
 'Tyranneutes virescens',
 'Lepidothrix serena',
 'Bucco capensis',
 'Laniocera hypopyrra',
 'Phoenicircus carnifex',
 'Myiopagis gaimardii',
 'Corythopis torquatus',
 'Lophotriccus vitiosus',
 'Tolmomyias assimilis',
 'Thamnophilus punctatus',
 'Gymnopithys rufigula',
 'Schiffornis olivacea',
 'Lanio fulvus',
 'Saltator grossus',
 'Tyrannulus elatus',
 'Hylopezus macularius',
 'Hylexetastes perroti',
 'Campylorhamphus procurvoides',
 'Thamnomanes ardesiacus',
 'Myrmotherula menetriesii',
 'Glyphorynchus spirurus',
 'Cymbilaimus lineatus',
 'Cyclarhis gujanensis',
 'Pachysylvia muscicapina',
 'Automolus ochrolaemus',
 'Automolus infuscatus',
 'Rhytipterna simplex',
 'Sirystes subcanescens',
 'Micrastur semitorquatus',
 'Myiarchus ferox',
 'Xiphorhynchus pardalotus',
 'Sittasomus griseicapillus',
 'Micrastur mirandollei',
 'Tunchiornis ochraceiceps',
 'Thamnomanes caesius',
 'Odontophorus gujanensis',
 'Deconychura longicauda',
 'Microbates collaris',
 'Dendrocolaptes picumnus',
 'Myrmotherula axillaris',
 'Dryocopus lineatus',
 'Conopias parvus',
 'Dendrexetastes rufigula']

specieslist.sort();
var speciesinput;

window.onload = (event) => {
  speciesinput = "Amazona autumnalis";
  fetch("./trial_5_model_full_evaluation.json")
        .then((res) => {
        return res.json();
    })
    .then((data) => createMatrix(data))
};

function showDropdown() {
  var i;
    for (i = 1; i < specieslist.length; i++) {
      //start at i = 1 because we already have the first species in the list (see       specificspecies.html)
      if (document.getElementsByClassName("dropdownspecies").length != 97) {
        var node = document.createElement('option');
        node.classList.add("dropdownspecies");
        node.appendChild(document.createTextNode(specieslist[i]));
        document.querySelector('select').appendChild(node);
      }
    }
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

function createMatrix(speciesdata) {
  const speciesinputarr = speciesinput.split(" ");
  const speciesnamearr = [""];
  for (i = 0; i < speciesinputarr.length; i++) {
    speciesnamearr.push(speciesinputarr[i], "_");
  }
  
  if (speciesnamearr.join("").includes("Pionus_menstruus")) {
    speciesnamearr.push("simple_call");
  } else if (speciesnamearr.join("").includes("Turdus_albicollis")) {
    speciesnamearr.push("simple_call");
  } else if (speciesnamearr.join("").includes("Dryocopus_lineatus")) {
    speciesnamearr.push("[lineatus_Group]_common_song");
  } else {
    speciesnamearr.push("common_song");
  }
  speciesname = speciesnamearr.join("");
  const speciesrow = speciesdata[speciesname];

  var a, b, c, d;
  b = parseFloat(speciesrow.false_positive_rate) * speciesrow.true_absence;
  d = speciesrow.true_absence - b;
  a = speciesrow.predicted_presence - b;
  c = speciesrow.predicted_absence - d;
  
  var data = [{
        z: [[c, d], 
            [a, parseInt(b)]],
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
        text: parseInt(b),
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
