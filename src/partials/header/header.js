import $ from 'jquery';
import { prefix } from '../../../conf';
import './header.scss';
import 'bootstrap-sass';
import getWeather from '../weather/weather';

$(document).ready(() => {
  $(`${prefix}-weather`).append(getWeather({
    lat: 40.7762691,
    lnt: -112.2006695,
    unit: 'f',
  }).then((res) => {
    // console.log(res);
    $(`.${prefix}-weather`).append($(`<i class="climacon i${res.code}"></i><span class="${prefix}-weather--temp"><b>${res.temp}</b><sup>°</sup></span>`));
  }));

  $('[data-dismiss=dropdown]').on('click', function () {
    $(this).closest('.dropdown').find('[data-toggle]').dropdown('toggle');
  });
});
