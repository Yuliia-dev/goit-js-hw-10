import debounce from 'lodash.debounce';
import './css/styles.css';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.2.min.css';
import countryList from '../src/country-list.hbs';
import countryName from '../src/country-name.hbs';

const DEBOUNCE_DELAY = 300;

const searchInputEL = document.querySelector('#search-box');
const countryInfoList = document.querySelector('.country-list');

searchInputEL.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));
debounce(showCountry, DEBOUNCE_DELAY);
debounce(fetchInput, DEBOUNCE_DELAY);

function searchCountry() {
  const textInput = searchInputEL.value;
  if (textInput === '') {
    countryInfoList.innerHTML = '';
    return;
  }
  fetchInput(textInput);
}

function showCountry(data) {
  if (data.length >= 10) {
    return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (data.length === 1) {
    const markupCountry = countryList(data);
    countryInfoList.innerHTML = markupCountry;
  } else {
    const markupCountry = countryName(data);
    countryInfoList.innerHTML = markupCountry;
  }
}

function fetchInput(textInput) {
  return fetch(`https://restcountries.com/v3.1/name/${textInput}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(showCountry)
    .catch(error => {
      countryInfoList.innerHTML = '';
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}
