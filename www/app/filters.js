angular.module('filters', [])

.filter('excludeSelectedPlayers', function () {
  return function (players, teams, teamId, memberId) {
    if (!players || !players.length) {
      return;
    }
    function comparePlayers(player_) {
      return function (player) {
        if (player.full_name !== player_.full_name) {
          return true;
        }
      };
    }
    for (var n = 0; n < 2; n++) {
      for (var m = 0; m < 2; m++) {
        if (teamId !== n || memberId !== m) {
          players = players.filter(comparePlayers(teams[n].members[m]));
        }
      }
    }
    return players;
  };
});
