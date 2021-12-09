let imageModelURL = './my_model/';
let input;
let genderSelect;
let gender="Female";
let img;
let icon;
let canvas;
let robotoFont;
let classifier;
let confidence = 0.0;
let label="none";
let lengthInput;
let lengthButton;
let widthInput;
let widthButton;
let recommendBtn;
let resultBool;
let _footLength;
let _footWidth; //circumference

function preload(){
  classifier =  ml5.imageClassifier(imageModelURL+"model.json");
  icon = loadImage('upload.png');
  robotoFont = loadFont('fonts/Roboto-Light.ttf');
}

function setup() {
  // noCanvas();
  
  let body = document.querySelector("body");
  let footer = document.querySelector("footer");
  body.after(footer);
  
  createP("Step 1. Upload top-view foot image")
    input = createFileInput(handleFile);
  
  createP("Step 2. Select gender");
   genderSelect = createSelect();
   genderSelect.option("Female");
   genderSelect.option("Male");
   genderSelect.selected("Female");
   genderSelect.changed(selectGender);
  
  
    createP("Step 3. Enter foot length.")
   createA("https://edeaskates.com/en/whats-my-size/measuring/","★ For accurate measurement click here ★");
  
    lengthInput=createInput().attribute('placeholder',"mm")
    lengthButton = createButton("submit");
    lengthButton.mousePressed(footLength)
    
    createP("Step 4. Enter foot circumference <br> (Make sure to measure all the way around the widest part of  ball of the foot) ")
  createSpan();
    widthInput = createInput().attribute("placeholder","mm");
    widthButton = createButton("submit");
    widthButton.mousePressed(footWidth);
    
    recommendBtn = createButton("Recommend me").attribute("id", "recommendBtn");
    recommendBtn.mousePressed(recommendBoots);
  
    dropDownGUI();
  
}

function draw() {  
  if (img) {
    imageMode(CORNER);
    image(img,0,0,250,250);

  } else {
    canvas.drop(handleFile);
  }
}

function selectGender(){
  gender = genderSelect.value();
}

function dropDownGUI(){
  canvas = createCanvas(250,250);
    background(255);
    image(icon,93,93);
    imageMode(CENTER);
  
    textSize(13);
    fill(100,100,100);
    textFont(robotoFont);
    textAlign(CENTER, CENTER);
    text("Drop and Down image here",width/2,height*2/3);
    text("or Browse by clicking down below",width/2,height*3/4);
}

function handleFile(file) {
  if (file.type === 'image') {
    img = createImg(file.data);
    img.hide();
    classifier.classify(img, classifyImage);
  } else {
    img = null;
  }
}

function classifyImage(error, results){
  if (error) {
    console.error(error);
    return;
  }
  // Store the label and classify again
  print(results[0])
  label = results[0].label;
  confidence = nf(results[0].confidence, 0, 2);
  print(label,confidence)
}

function footLength(){
  _footLength = lengthInput.value();
}

function footWidth() {
  _footWidth = widthInput.value();
}

function toInch(length){
  var inches = (length*0.0393701);
  return inches;
}

function roundLength(length){
  cm_length = length + 7;
  diff_length = cm_length % 5;
  cm_length -= diff_length;
  
  var inches = toInch(length)
  return {"cm":cm_length, "inches":inches};
}

function edea(gender, length, width){
  var edeaChart = {"AA":"B or C","B":"C or D","C":"D or E","D":"E"};
  var type = risport(gender, length, width);
  return edeaChart[type];
}

function risport(gender, length, width){
  var startSize = [179,189,199,209];
  var type = ["AA","B","C","D"];
  var i;
  
  if (length >= 200){
      tempLength = length - 200;
      steps = tempLength/5;
      for (i=0; i<4; i++) {
          startSize[i] = startSize[i]+3*steps;
      }

      for (i=3; i>=0; i--){
          if (width >= startSize[i]){
            break;
          }
      }
  }

  switch(gender){
    case "Female":
      if(200<=length<=280) {
        return type[i];
      } else {
        return false;
      }
      break;
    case "Male":
      if (230<=length<=305){
        return type[i];
      } else {
        return false;
      }
      break;
  }
}

function jackson(gender, length, width) {
  var lengthStep = [3/16,3/16,2/16,3/16,2/16,3/16,2/16,3/16,3/16,
                         2/16,3/16,2/16,3/16,3/16,2/16,3/16,2/16,3/16,2/16,3/16,2/16];
  var startLength = 8.625;
  var startWidth = [7.3125, 7.5, 7.6875, 8.0625, 8.25];
  var startSize = ['AA','A','B','C','D'];
  var startMale = 2.5;
  var startFemale = 4;
  
  var resultWidth;
  var resultLength;
  
  let step, j;
   for (step=0; step < 22; step++){
     if (length < startLength){
       break;
     }
     startLength += lengthStep[step]

     for (j = 0; j < 5; j++){
       startWidth[j] += 2/16;
     }
   }

    for(j = 0;j < 5;j++){
      if(width < startWidth[j]){
        resultWidth = startWidth[j];
        break;
      }
    }     
    resultWidth = startSize[j];
  
  switch(gender){
    case "Female":
      
      switch(resultWidth){
        case 'AA':
          if (step >= 13) {
            resultWidth = "not avaliable";
          }
          break;
        case 'A':
          if (step >= 15) {
            resultWidth = "not avaliable";
          }
          break;
      }
      resultLength = startFemale + step * 0.5;
      resultWidth = "Ladies' "+resultWidth;
      break;
    case "Male":
      switch(resultWidth){
        case 'AA' || 'A':
          resultWidth = "not avaliable";
          break;
        case 'B':
          resultWidth = 'N';
          break;
        case 'C':
          resultWidth = 'M';
          break;
        case 'D':
          resultWidth = 'W';
          break;
      }     
      resultLength = startMale + step*0.5;
      resultWidth = "Mens' "+resultWidth;
      break;
  }
  return {"length":resultLength, "width":resultWidth};
}

function skateResult(brandName, gender, length, brandType){
  imageFile = "<img src = 'assets/"+brandName+"-"+gender+".jpg'/>"
  createDiv().attribute("id","result"+brandName);
  descript_1 = createDiv().attribute("id","descript-1-"+brandName)
  descript_1.parent("result"+brandName);
  texts = createDiv("we offer you..").attribute("id","texts")
  texts.parent("descript-1-"+brandName)
  title = createDiv(brandName+" Skates").attribute("id","title")
  title.parent("descript-1-"+brandName)

  descript_2 = createDiv().attribute("id","descript-2-"+brandName)
  descript_2.parent("result"+brandName)
  size = createDiv("⛸ skate size: "+length).attribute("id","size")
  size.parent("descript-2-"+brandName)
  ballType = createDiv("⛸ skate width: "+brandType).attribute("id","type")
  ballType.parent("descript-2-"+brandName)
}

function recommendBoots(){
    
  lengths = roundLength(int(_footLength))


  if(_footLength && _footWidth && label!="none"){
    if(_footLength < 200) {
      createP("Adult size recommendation only")
    } else {
      switch(label){
         case "Greek":
           risportType = risport(gender, lengths.cm, _footWidth);
           edeaType = edea(gender, lengths.cm, _footWidth);
           skateResult("Edea", gender, lengths.cm, edeaType)
           skateResult("Risport", gender, lengths.cm, risportType)
           break;
         case "Roman" || "Round":
           edeaType = edea(gender, lengths.cm, _footWidth);
          jacksonResult = jackson(gender, lengths.inches, toInch(_footWidth))
           skateResult("Edea",gender, lengths.cm, edeaType);
          skateResult("Jackson", gender, jacksonResult.length, jacksonResult.width );
           break;      
         case "Egyptian": 
           edeaType = edea(gender, lengths.cm, _footWidth);
           risportType = risport(gender, lengths.cm, _footWidth);
          jacksonResult = jackson(gender, lengths.inches, toInch(_footWidth))
           skateResult("Edea", gender, lengths.cm, edeaType);
           skateResult("Risport",gender, lengths.cm, risportType);
           skateResult("Jackson", gender, jacksonResult.length, jacksonResult.width );
           break;
         default:
           //
       }
    }   
  } 
  print(_footLength, _footWidth, label, gender);
}
