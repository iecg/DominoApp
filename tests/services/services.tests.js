describe('Players unit test', function() {
  var Players;

  beforeEach(module('services'));

  beforeEach(inject(function(_Players_) {
    Players = _Players_;
  }));

  it('can get an instance', inject(function(Players) {
    expect(Players).toBeDefined();
  }));

  it('has 0 players', inject(function(Players) {
    expect(Players.all().length).toEqual(0);
  }));

  it('returns player with full name Isaac Cocar', inject(function(Players) {
    var player = Players.new('Isaac', 'Cocar');
    expect(player.fullName).toEqual('Isaac Cocar');
  }));

  it('returns player with full name Isaac Cocar', inject(function(Players) {
    var player = Players.new('isaac', 'cocar');
    expect(player.fullName).toEqual('Isaac Cocar');
  }));

  it('returns player with full name " "', inject(function(Players) {
    var player = Players.new();
    expect(player.fullName).toEqual(' ');
  }));

  it('player has 1 win', inject(function(Players) {
    var player = Players.new();
    player.win();
    expect(player.wins).toEqual(1);
  }));
});
