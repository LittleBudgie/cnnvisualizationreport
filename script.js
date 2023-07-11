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
  var dropdown = document.getElementById("MyDropdown");
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
  } else {
    speciesnamearr.push("common_song");
  }
  speciesname = speciesnamearr.join("");
  const speciesrow = speciesdata[speciesname];
  var data = [{
        z: [[speciesrow.true_presence, speciesrow.true_absence], 
            [speciesrow.predicted_presence, speciesrow.predicted_absence]],
        type: 'heatmap',
        x: [speciesinput, 'Not ' + speciesinput],
        y: ['Not ' + speciesinput, speciesinput],
      }];
  var layout = {
    title: 'Confusion Matrix for ' + speciesinput,
    yaxis: {
      automargin: true
    }
  };
  Plotly.newPlot('confusionmatrix', data, layout);
  
}
