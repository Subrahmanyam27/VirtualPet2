var dog,happyDog,database,foodS,foodStock;
var notsmilingdog,smilingdog;
var fedTime,lastFed;

function preload(){

  notsmilingdog = loadImage("Dog.png");
  smilingdog = loadImage("happydog.png");

}

function setup() {
  createCanvas(1000,700);

  foodObj = new Food();

  dog = createSprite(750,350);
  dog.addImage(notsmilingdog);
  dog.scale = 0.4;

  database = firebase.database();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);
  
  feed = createButton("Feed the dog");
  feed.position(900, 90);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(1000, 90);
  addFood.mousePressed(addFoods);

}

function draw() {  
  background(46,139,87);

  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })

  drawSprites();

    fill("white");
    textSize(50);
    if (lastFed >= 12) {
        text("Last Feed : " + lastFed % 12 + " PM", 110, 70);
    } else if (lastFed == 0) {
        text("Last Feed : 12 AM", 110, 70);
    } else {
        text("Last Feed : " + lastFed + " AM", 110, 70);
    }

}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(smilingdog);

  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
      Food: foodObj.getFoodStock(),
      FeedTime: hour()
  })
}

function addFoods() {
  foodS++;
  database.ref('/').update({
      Food: foodS
  })
}