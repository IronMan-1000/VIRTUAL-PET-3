var dogImg, happyDogImg, dog, database, foodS, foodStock, canvas, lastFed, fedTime, foodObj, feed, addFood, food1, foodCount, input, milk, milkImg, sadDog;
var backImage;
var changeState, readState;
var bedroom, bedroomImg, garden, gardenImg, washroom, washroomImg;

function preload() {
  dogImg = loadImage('images/Dog.png');
  happyDogImg = loadImage('images/dogImg1.png');
  milkImg = loadImage('images/Milk.png');
  backImage = loadImage('images/back.jpg');
  bedroomImg = loadImage('virtual pet images/Bed Room.png');
  gardenImg = loadImage('virtual pet images/Garden.png');
  washroomImg = loadImage('virtual pet images/Wash Room.png');
  sadDog = loadImage('virtual pet images/deadDog.png');

}

function setup() {
  database = firebase.database();

  dog = createSprite(1000, 450);
  dog.scale = 0.3;
  dog.addImage(dogImg);

  milk = createSprite(900, 500);
  milk.addImage(milkImg);
  milk.scale = 0.1;
  milk.visible = false;
  milk.rotation = 55;
  
  food1 = new Food();
  
  food1.start();

  addFood = createButton("ADD FOOD");
  addFood.position(885, 135);
  addFood.mousePressed(addFoods);

  input = createInput("YOUR DOG'S NAME");
  input.position(50, 135);

  feed = createButton("FEED YOUR DOG");
  feed.position(1010, 135);
  feed.mousePressed(feedDog);

  canvas = createCanvas(1200, 600);

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value", function(data){
    gameState=date.val();
  });
}

function draw() {  
  background(backImage);

  food1.display();

  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry");
    foodObj.display();
  }

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();

  }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

  drawSprites();

  strokeWeight(10);
  stroke(random(0, 255), random(0, 255), random(0, 255));
  fill("yellow");
  textSize(40);
  text("VIRTUAL PET", 450, 50)
  noStroke();

  textSize(17);
  fill("yellow");
  text("I am your Puppy 🐶 ...😍 I am Hungry...Please can you feed me!! ",315,150);
  fill("yellow");
  text("Note: Press the ADD FOOD button to get food... Press FEED YOUR DOG to feed the dog...",250,100);


}

function feedDog() {
  food1.getFoodStock();
  food1.updateFedTime();

  if(foodCount === 0) {
    foodCount = 0;
    milk.visible = false;
    dog.addImage(dogImg);
  } else {
    food1.updateFoodStock(foodCount - 1);
    milk.visible = true;
    dog.addImage(happyDogImg);
  }
}

function addFoods() {
 food1.getFoodStock();

 food1.updateFoodStock(foodCount + 1); 
}
function update(state){
  database.ref('/').update({
    gameState:state
  })
}