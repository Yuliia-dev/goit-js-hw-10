import debounce from 'lodash.debounce';
import './css/styles.css';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.2.min.css';
import countryList from '../src/country-list.hbs';
import countryName from '../src/country-name.hbs';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchInputEL = document.querySelector('#search-box');
const countryInfoList = document.querySelector('.country-list');

searchInputEL.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));
debounce(showCountry, DEBOUNCE_DELAY);

function searchCountry() {
  const name = searchInputEL.value.trim();
  if (name === '') {
    countryInfoList.innerHTML = '';
    return;
  }
  fetchCountries(name)
    .then(showCountry)
    .catch(error => {
      countryInfoList.innerHTML = '';
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function showCountry(data) {
  if (data.length >= 10) {
    countryInfoList.innerHTML = '';
    return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (data.length === 1) {
    const markupCountry = countryList(data);
    countryInfoList.innerHTML = markupCountry;
  } else {
    const markupCountry = countryName(data);
    countryInfoList.innerHTML = markupCountry;
  }
}
