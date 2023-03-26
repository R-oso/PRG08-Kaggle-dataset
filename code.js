import { DecisionTree } from "./libraries/decisiontree.js";
import { VegaTree } from "./libraries/vegatree.js";

//class,cap-shape,cap-surface,cap-color,bruises,odor,gill-attachment,gill-spacing,gill-size,gill-color,stalk-shape,stalk-root,stalk-surface-above-ring,stalk-surface-below-ring,stalk-color-above-ring,stalk-color-below-ring,veil-type,veil-color,ring-number,ring-type,spore-print-color,population,habitat
let ignoredString = "cap-shape,cap-surface,cap-color,bruises,odor,gill-attachment,gill-spacing,gill-size,gill-color,stalk-shape,stalk-root,stalk-surface-above-ring,stalk-surface-below-ring,stalk-color-above-ring,stalk-color-below-ring,veil-type,veil-color,ring-number,ring-type,spore-print-color,population,habitat";
let ignoredArray = ignoredString.split(",");

let emptyArray = [];

let label = "class";

// variabelen om de accuracy uit te rekenen
let amountCorrect = 0;
let totalAmount = 0;

// variabelen om de confusion matrix te weergeven
let eButP = 0;
let pButE = 0;
let e_e = 0;
let p_p = 0;

function loadData() {
  Papa.parse("./Extra files/mushrooms.csv", {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: (results) => trainModel(results.data),
  });
}

function trainModel(data) {
  // sort de data en verdeel het in train -en test classes
  data.sort(() => Math.random() - 0.5);
  let trainData = data.slice(0, Math.floor(data.length * 0.8));
  let testData = data.slice(Math.floor(data.length * 0.8) + 1);

  let decisionTree = new DecisionTree({
    ignoredAttributes: [],
    trainingSet: trainData,
    categoryAttr: label,
  });

  // zet om naar JSON
  let json = decisionTree.toJSON();

  // predict met testdata
  predict(testData, decisionTree);

  // teken de tree
  // let visual = new VegaTree("#view", 2300, 1000, json);
}

function predict(testData, decisionTree) {
  for (let shroom of testData) {
    // kopie van shroom maken, zonder het label
    const shroomWithoutLabel = Object.assign({}, shroom);
    delete shroomWithoutLabel.class;

    //console.log(shroomWithoutLabel);

    let prediction = decisionTree.predict(shroomWithoutLabel);

    // verkeerde voorspellingen
    if (prediction == "e" && shroom.class == "p") {
      eButP++;
    }
    if (prediction == "p" && shroom.class == "e") {
      pButE++;
    }

    // correcte voorspellingen
    if (prediction == "e" && shroom.class == "e") {
      e_e++;
    }
    if (prediction == "p" && shroom.class == "p") {
      p_p++;
    }
    console.log(prediction + "  " + shroom.class);
    if (prediction === shroom.class) {
      // console.log('Deze voorspelling is goed gegaan!')
      amountCorrect++;
    } else {
      // console.log('Deze voorspelling klopt niet!')
    }
  }
  let totalAmount = testData.length;
  let accuracy = amountCorrect / testData.length;
  console.log(`${amountCorrect} out of ${testData.length} have been predicted correctly`);
  console.log(`The accuracy of the predictions is ${accuracy}%`);

  showMatrix(eButP, pButE, amountCorrect, totalAmount, accuracy, e_e, p_p);
}

function showMatrix(eButP, pButE, amountCorrect, totalAmount, accuracy, e_e, p_p) {
  // confusion matrix elements ophalen
  let true_true = document.getElementById("true_true");
  let true_false = document.getElementById("true_false");
  let false_true = document.getElementById("false_true");
  let false_false = document.getElementById("false_false");

  let a = document.getElementById("accuracy");
  let amount = document.getElementById("totalAmount");

  //innerHTML van elementen
  true_true.innerHTML = e_e;
  true_false.innerHTML = eButP;
  false_true.innerHTML = pButE;
  false_false.innerHTML = p_p;

  a.innerHTML = accuracy;
  amount.innerHTML = totalAmount;
}

loadData();
