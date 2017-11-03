import Dropdown from './components/Dropdown';
import ReactDropdown from './components/Dropdown/react';

const changeNotifier = document.querySelector('#change-notifier');

const dropdown = new Dropdown(document.querySelector('[data-dropdown]'));
dropdown.on('valueChange', (value) => updateNotifier('Vanilla', value));

ReactDOM.render(
  <ReactDropdown 
    options={['Apples', 'Bananas', 'Oranges']} selectedIndex={0} onValueChange={(value) => updateNotifier('React', value)} />, document.querySelector('#app'));

function updateNotifier(source, value) {
  changeNotifier.innerHTML = `<strong>${source}</strong> component value change to <em> ${value}</em>`;
}