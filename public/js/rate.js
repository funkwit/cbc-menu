var sessions = {"container-a": 1, "container-b": 2, "container-c": 3};
window.beers = _.sortBy(window.beers, function(beer) { return sessions[beer.session] });

var indexedBeers = {};
window.beers.forEach(function(beer) {
  indexedBeers[beer.id] = beer;
});


var idArray = _.pluck(window.beers, 'id');

function orderByProp(prop) {
  return _.chain(idArray)
    .reject(function(beer) { return !indexedBeers[beer][prop] })
    .sortBy(function(beer) { return -indexedBeers[beer][prop] })
    .value()
}

window.beersByUntappd = orderByProp('ut_rating');

var rankGroups = {
  'ut_rating': beersByUntappd,
  'live_rating': orderByProp('live_rating')
};

window.beerSubsetWithRankings = function(filter) {
  var groupSubsets = {};
  Object.keys(rankGroups).forEach(function(group) {
    groupSubsets[group] = _.select(rankGroups[group], function(beer) { return filter(indexedBeers[beer]) })
  });
  return _.chain(window.beers)
    .select(filter)
    .map(function(beer) {
      Object.keys(groupSubsets).forEach(function(group) {
        var index = groupSubsets[group].indexOf(beer.id);
        if (index == -1) return;
        beer[group + '_rank'] = index + 1;
        beer[group + '_rank_br'] = ' (#' + (index + 1) + ')';
      });
      return beer;
    })
    .value();
}
