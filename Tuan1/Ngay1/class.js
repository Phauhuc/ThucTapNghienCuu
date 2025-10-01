class Animal {
    constructor(name){
      this.name = name;
    }
    speak(){ return `${this.name} makes a sound`; }
  }
  
  class Dog extends Animal {
    speak(){ return `${this.name} barks`; }
  }
  
  const d = new Dog('Bingo');
  console.log(d.speak());
  