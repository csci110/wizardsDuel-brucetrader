import { game, Sprite } from "../sgc/sgc.js";
//Preload Images
game.preloadImage("floor.png");
game.preloadImage("marcusSheet.png", 48, 48);
game.preloadImage("marcusSpellSheet.png", 48, 48);
game.preloadImage("strangerSheet.png", 48, 48);
game.preloadImage("fireballSheet.png", 48, 48);
game.preloadImage("strangerSpellSheet.png", 48, 48);

//set background
game.setBackground("floor.png");

//create Wizard
class PlayWizard extends Sprite {
    constructor() {
        super();
        this.name = "Marcus the Wizzars";
        this.setImage("marcusSheet.png");
        this.width = 48;
        this.height = 48;
        this.x = this.width;
        this.y = this.height;
        this.defineAnimation("down", 6, 8);
        this.defineAnimation("up", 0, 2);
        this.defineAnimation("right", 3, 5);
        this.speedWhenWalking = 100;
        this.spellCastTime = 0;
    }
    handleDownArrowKey() {
        this.playAnimation("down");
        this.speed = this.speedWhenWalking;
        this.angle = 270;
    }
    handleUpArrowKey() {
        this.playAnimation("up");
        this.speed = this.speedWhenWalking;
        this.angle = 90;
    }

    handleGameLoop() {
        this.y = Math.max(0, this.y);
        this.y = Math.min(game.displayHeight - this.height, this.y);
        this.speed = 0;
    }

    handleSpacebar() {
        let now = game.getTime();
        if(now - this.spellCastTime >=1){
            this.playAnimation("right");
        let spell = new Spell();
        spell.x = this.x + 50;
        spell.y = this.y;
        spell.name = "A spell cast by Marcus";
        spell.setImage("marcusSpellSheet.png");
        spell.angle = 0;
            this.spellCastTime = now;
        }
        
    }
}

//create spells
class Spell extends Sprite {
    constructor() {
        super();
        this.speed = 200;
        this.height = 48;
        this.width = 48;
        this.defineAnimation("magic", 0, 7);
        this.playAnimation("magic", true);
    }

    handleBoundryContact() {
        game.removeSprite(this);
    }

    handleCollision(otherSprite) {
        if (this.getImage() !== otherSprite.getImage()) {
            let verticalOffset = Math.abs(this.y - otherSprite.y);
            if (verticalOffset < this.height / 2) {
                game.removeSprite(this);
                new Fireball(otherSprite);
            }
        }
        return false;
    }
}

class nonPlayWizard extends Sprite {
    constructor() {
        super();
        this.name = "The mysterius stranger";
        this.setImage("strangerSheet.png");
        this.height = 48;
        this.width = 48;
        this.x = game.displayWidth - 2 * this.width;
        this.y = this.height;
        this.angle = 270;
        this.speed = 150;
        this.defineAnimation("down", 6, 8);
        this.defineAnimation("up", 0, 2);
        this.defineAnimation("left", 9, 11);
        this.playAnimation("down");
    }
    handleGameLoop() {
        if (this.y <= 0) {
            this.y = 0;
            this.angle = 270;
            this.playAnimation("down");
        }
        if (this.y >= game.displayHeight - this.height) {
            this.y = game.displayHeight - this.height;
            this.angle = 90;
            this.playAnimation("up");
        }
        if(Math.random() < 0.05){
          this.playAnimation("left");
        let spell = new Spell();
        spell.x = this.x - 50;
        spell.y = this.y;
        spell.name = "A spell cast by Stranger";
        spell.setImage("strangerSpellSheet.png");
        spell.angle = 180;  
        }
        
        
        
        
        
        
        
        
    }
    handleAnimationEnd() {
        if (this.angle == 90) {
            this.playAnimation("up");
        }
        if (this.angle == 270) {
            this.playAnimation("down");
        }
    }
}

class Fireball extends Sprite {
    constructor(deadSprite) {
        super();
        this.name = "a ball of fire";
        this.setImage("fireballSheet.png");
        this.height = 48;
        this.height = 48;
        this.x = deadSprite.x;
        this.y = deadSprite.y;
        this.defineAnimation("explotion", 0, 7);
        this.playAnimation("explotion");
        game.removeSprite(deadSprite);
    }
    handleAnimationEnd() {
        game.removeSprite(this);
        if (!game.isActiveSprite(stranger)) {
            game.end("Congratulations!\n\nMarcus has defeated the mysterious" +
                "\nstranger in the dark cloak!");
        }
        if(!game.isActiveSprite(marcus)){
            game.end("Marcus is defeated by the mysterious\nstranger in the dark cloak!\n\nBetter luck next time.");
        }
    }
}

let stranger = new nonPlayWizard();
let marcus = new PlayWizard();
