describe('Players unit test', function() {
  var Players;

  beforeEach(module('services'));

  beforeEach(inject(function(_Players_, _$window_) {
    Players = _Players_;
    $window = _$window_;
  }));

  afterEach(function () {
    $window.localStorage.clear();
  });

  it('Test 1: Can get an instance', inject(function(Players) {
    expect(Players).toBeDefined();
  }));

  it('Test 2: Players.all()', inject(function(Players) {
    expect(Players.all().length).toEqual(0);
    Players.create('isaac', 'cocar');
    Players.create('isaac', 'cocar');
    expect(Players.all().length).toEqual(2);
  }));

  it('Test 3: Players.new()', inject(function(Players) {
    var player = Players.new('Isaac', 'Cocar');
    expect(player.fullName).toEqual('Isaac Cocar');
    player = Players.new('isaac', 'cocar');
    expect(player.fullName).toEqual('Isaac Cocar');
    player = Players.new();
    expect(player.fullName).toEqual('');
  }));

  it('Test 4: player.win()', inject(function(Players) {
    var player = Players.new();
    player.win();
    expect(player.wins).toEqual(1);
  }));

  it('Test 5: Players.get()', inject(function(Players) {
    Players.create('isaac', 'cocar');
    Players.create('isaac', 'cocar');
    expect(Players.get(2).id).toEqual(2);
    expect(Players.get(10)).toBeUndefined();
  }));

  it('Test 6: Players.delete()', inject(function(Players) {
    var player = Players.create('isaac', 'cocar');
    Players.delete(player);
    expect(Players.get(1)).toBeUndefined();
    expect(Players.all().length).toEqual(0);
  }));
});
