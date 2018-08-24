import $ from 'jquery';

function getWeather(options) {
  const queryUri = `https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where u='${
    options.unit ? options.unit : 'c'
  }' AND woeid in (SELECT woeid FROM geo.places WHERE text="(${options.lat},${
    options.lnt
  })")&format=json`;

  return $.ajax(queryUri).then((res) => {
    if (res.status >= 400) {
      throw new Error('Bad response from server');
    }
    return res.query.results
      ? res.query.results.channel.item.condition
      : { code: 'NA', temp: 'NA' };
  });
}

export default getWeather;
