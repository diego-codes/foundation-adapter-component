import DropdownFoundation from './foundation';

export default class Dropdown {
  get options() {
    return Array.from(this._root.querySelectorAll("[role=option]"));
  }

  get selectedOptions() {
    return Array.from(
      this._root.querySelectorAll("[role=option][aria-selected]")
    );
  }

  get selectedIndex() {
    return this._foundation.selectedIndex;
  }

  set selectedIndex(index) {
    this._foundation.setSelectedOptionIndex(index);
  }

  get value() {
    return this._foundation.value;
  }

  get disabled() {
    return this._foundation.disabled;
  }

  set disabled(shouldDisable) {
    return (this._foundation.disabled = shouldDisable);
  }

  constructor(root) {
    this._root = root;
    this._button = this._root.querySelector(`.${Dropdown.BUTTON_CLASS_NAME}`);
    this._buttonSelection = this._button.querySelector(
      `.${Dropdown.SELECTION_CLASS_NAME}`
    );
    this._list = this._root.querySelector(`.${Dropdown.LIST_CLASS_NAME}`);
    this._optionsEnum = this._getElementsMap(this.options);
    this._valueChangeHandlers = [];
    this._foundation = this.getDefaultFoundation();

    const { selectedOptions } = this;

    if (selectedOptions) {
      this.selectedIndex = this._optionsEnum.get(selectedOptions[0]);
    }

    this.disabled = this._root.hasAttribute("aria-disabled");

    this._foundation.init();
    return this;
  }

  getDefaultFoundation() {
    return new DropdownFoundation({
      registerInteractionHandler: (eventType, handler) => this._root.addEventListener(eventType, handler),
      deRegisterInteractionHandler: (eventType, handler) => this._root.removeEventListener(eventType, handler),
      registerBodyInteractionHandler: (eventType, handler) => window.addEventListener(eventType, handler),
      deRegisterBodyInteractionHandler: (eventType, handler) => window.removeEventListener(eventType, handler),
      setAttr: (attribute, value) => this._root.setAttribute(attribute, value),
      removeAttr: attribute => this._root.removeAttribute(attribute),
      addClass: className => this._root.classList.add(className),
      removeClass: className => this._root.classList.remove(className),
      containsClass: className => this._root.classList.contains(className),
      getElementAttribute: (element, attribute) => element.getAttribute(attribute),
      setOptionAttr: (index, attribute, value) => this.options[index].setAttribute(attribute, value),
      removeOptionAttr: (index, attribute) => this.options[index].removeAttribute(attribute),
      getOptionIndex: element => this._optionsEnum.get(element),
      getOptionText: index => this.options[index].textContent,
      getOptionValue: index => this.options[index].id || this.options[index].name,
      getOptionsLength: () => this.options.length,
      setSelectionText: text => (this._buttonSelection.textContent = text),
      makeTabbable: () => this._root.setAttribute("tabindex", 0),
      makeUntabbable: () => this._root.removeAttribute("tabindex"),
      notifyValueChange: (value) => this._valueChangeHandlers.forEach(handler => handler(value)),
    });
  }
  
  on(eventType, handler) {
    // Currently ignoring the eventType, but this could help map out handlers to any given event.
    this._valueChangeHandlers.push(handler);
  }

  _getElementsMap(elements) {
    return new Map(
      elements.map((element, elementIndex) => [element, elementIndex])
    );
  }
}

Dropdown.BUTTON_CLASS_NAME = "dropdown__button";
Dropdown.SELECTION_CLASS_NAME = "dropdown__selection";
Dropdown.LIST_CLASS_NAME = "dropdown__options";
