(function() {

  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Game = Asteroids.Game = function (optionsHash) {
    this.DIM_X = optionsHash.DIM_X;
    this.DIM_Y = optionsHash.DIM_Y;
    this.asteroids = [];
    this.planets = [];
    this.items = [];
    this.addPlanets();
    this.addShields();
    this.bullets = [];
    this.explosions = [];
    this.ship = new Asteroids.Ship({
      pos : [ 50, this.DIM_Y / 2]
    });

    this.shields = 100;
    this.points = 0;

    key('w', function() {this.power([0,-1]);}.bind(this.ship));
    key('d', function() {this.power([1,0]);}.bind(this.ship));
    key('s', function() {this.power([0,1]);}.bind(this.ship));
    key('a', function() {this.power([-1,0]);}.bind(this.ship));
    key('p', function() {this.ship.fireBullet(this);}.bind(this));
    this.addAsteroids();
  };

  Game.prototype.addPlanets = function () {
    window.setInterval(function () {
      var that = this;
      if (that.planets.length < 2) {
        var rad = Math.floor(Math.random() * 150) + 5;
        var newPlanet = new Asteroids.Planet({
          pos: this.randomPosition(),
          vel: [-rad / 50, 0],
          radius: rad
        });
        this.planets.push(newPlanet);
      }
    }.bind(this), 400);
  };

  Game.prototype.addAsteroids = function () {
    window.setInterval(function () {
      var newAst = new Asteroids.Asteroid({
        pos : this.randomPosition(),
        vel : [Math.floor(Math.random() * -5) - 7, 0],
        radius : Math.floor(Math.random() * 100) + 30
      });
      this.asteroids.push(newAst);
    }.bind(this), 300);
  };

  Game.prototype.addShields = function () {
    window.setInterval(function () {
      var that = this;
      if (that.items.length < 1) {
        var newShield = new Asteroids.Shield({
          pos : this.randomPosition(),
          vel : [Math.floor(Math.random() * -5) - 7, 0],
          radius : Math.floor(Math.random() * 100) + 20
        });
        this.items.push(newShield);
      }
    }.bind(this), 2000);
  };

  Game.prototype.randomPosition = function () {
    var x = this.DIM_X + 100;
    var y = Math.floor(Math.random() * this.DIM_Y );
    return [x, y];
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
    ctx.fillStyle = '#0ff';
    this.allObjects().forEach(function (object) {
      object.draw(ctx, this);
    }.bind(this));
    var shieldDiv = $('.shields-num');
    shieldDiv.text(Math.round(this.shields) + '%');
    var pointsDiv = $('.points-num');
    pointsDiv.text(Math.round(this.points));
  };

  Game.prototype.moveObjects = function () {
    this.allObjects().forEach(function (object) {
      object.move(this.DIM_X, this.DIM_Y);
      if (this.isOutOfBounds(object.pos)) {
        this.remove(object);
      }
    }.bind(this));
  };

  Game.prototype.checkCollisions = function (first_argument) {
    var allObs = this.allObjects();
    for (var i = 0; i < allObs.length - 1; i++) {
      for (var j = i + 1; j < allObs.length; j++) {
        if (allObs[i].isCollidedWith(allObs[j])) {
          allObs[i].collideWith(allObs[j], this);
        }
      }
    }
  };

  Game.prototype.step = function () {
    this.moveObjects();
    this.checkCollisions();
  };

  Game.prototype.remove = function (object) {
    if (object.__proto__ === Asteroids.Asteroid.prototype ) {
      var index = this.asteroids.indexOf(object);
      this.asteroids.splice(index, 1);
    } else if (object.__proto__ === Asteroids.Planet.prototype ) {
      var index = this.planets.indexOf(object);
      this.planets.splice(index, 1);
    } else if (object.__proto__ === Asteroids.Bullet.prototype) {
      var index = this.bullets.indexOf(object);
      this.bullets.splice(index, 1);
    } else if (object.__proto__ === Asteroids.Shield.prototype) {
      var index = this.items.indexOf(object);
      this.items.splice(index, 1);
    } else if (object.__proto__ === Asteroids.Explosion.prototype) {
      var index = this.explosions.indexOf(object);
      this.explosions.splice(index, 1);
    } else if (object.__proto__ === Asteroids.Ship.prototype) {
      this.ship = [];
    }
  };

  Game.prototype.allObjects = function () {
    if (this.shields > 0) {
      return this.bullets.concat(this.asteroids).concat(this.items).concat(this.planets).concat(this.explosions).concat([this.ship]);
    } else {
      var exp = new Asteroids.Explosion({
        pos : this.ship.pos,
        vel : this.ship.vel,
        radius : 100
      });
      this.explosions.push(exp);
      return this.bullets.concat(this.asteroids).concat(this.items).concat(this.planets).concat(this.explosions);
    }
  };

  Game.prototype.isOutOfBounds = function (pos) {
    var x = pos[0];
    var y = pos[1];

    if (x < -100 || x > this.DIM_X + 150) {
      return true;
    } else {
      return false;
    }
  };
})();
