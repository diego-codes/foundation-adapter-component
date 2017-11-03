import KeyCode from '../../utilities/KeyCode';

export default class DropdownFoundation {
  static get defaultAdapter() {
    return {
      registerInteractionHandler: () => {},
      deRegisterInteractionHandler: () => {},
      registerBodyInteractionHandler: () => {},
      deRegisterBodyInteractionHandler: () => {},
      setAttr: () => {},
      removeAttr: () => {},
      addClass: () => {},
      removeClass: () => {},
      containsClass: () => {},
      getElementAttribute: () => '',
      setOptionAttr: () => {},
      removeOptionAttr: () => {},
      getOptionIndex: () => -1,
      getOptionText: () => '',
      getOptionValue: () => '',
      getOptionsLength: () => 0,
      setSelectionText: () => {},
      makeTabbable: () => {},
      makeUntabbable: () => {},
      notifyValueChange: () => {},
    };
  }

  get isOpen() {
    return this._adapter.containsClass(DropdownFoundation.OPEN_CLASS_NAME);
  }

  get value() {
    if (this.selectedIndex < 0) {
      return undefined;
    }

    return this._adapter.getOptionValue(this.selectedIndex);
  }

  set disabled(shouldDisable) {
    if (shouldDisable) {
      this._adapter.makeUntabbable();
      this._adapter.setAttr('aria-disabled', 'aria-disabled');
      this._isDisabled = true;
    } else {
      this._adapter.makeTabbable();
      this._adapter.removeAttr('aria-disabled');
      this._isDisabled = false;
    }
  }

  get disabled() {
    return this._isDisabled;
  }

  constructor(adapter) {
    this._adapter = Object.assign(DropdownFoundation.defaultAdapter, adapter);
    this._rootClickHandler = this._rootClickHandler.bind(this);
    this._bodyClickHandler = this._bodyClickHandler.bind(this);
    this._rootKeydownHandler = this._rootKeydownHandler.bind(this);
    this.selectedIndex = -1;
  }

  init() {
    this._adapter.registerInteractionHandler('click', this._rootClickHandler);
    this._adapter.registerInteractionHandler(
      'keydown',
      this._rootKeydownHandler
    );
  }

  destroy() {
    this._adapter.deRegisterInteractionHandler('click', this._rootClickHandler);
    this._adapter.deRegisterInteractionHandler(
      'keydown',
      this._rootKeydownHandler
    );
  }

  toggle() {
    return this.isOpen ? this.close() : this.open();
  }

  open() {
    this._adapter.addClass(DropdownFoundation.OPEN_CLASS_NAME);
    this._adapter.registerBodyInteractionHandler(
      'click',
      this._bodyClickHandler
    );
  }

  close() {
    this._adapter.removeClass(DropdownFoundation.OPEN_CLASS_NAME);
    this._adapter.deRegisterBodyInteractionHandler(
      'click',
      this._bodyClickHandler
    );
  }

  _rootClickHandler(evt) {
    if (this._isDisabled) {
      return;
    }

    evt.stopPropagation();
    const { target } = evt;
    const targetIsOption = this._adapter.getElementAttribute(target, 'role') === 'option';
    const optionIndex = targetIsOption ? this._adapter.getOptionIndex(target) : -1;

    if (optionIndex > -1) {
      this.setSelectedOptionIndex(optionIndex);
      this.close();
      return;
    }
    this.toggle();
  }

  setSelectedOptionIndex(optionIndex) {
    if (optionIndex >= 0 && optionIndex < this._adapter.getOptionsLength()) {
      if (Number.isInteger(this.selectedIndex) && this.selectedIndex > -1) {
        this._adapter.removeOptionAttr(this.selectedIndex, 'aria-selected');
      }

      this.selectedIndex = optionIndex;
      const optionValue = this._adapter.getOptionValue(this.selectedIndex);
      const optionId = this._adapter.setAttr('aria-active-descendant', optionValue);
      this._adapter.setOptionAttr(this.selectedIndex, 'aria-selected', 'aria-selected');
      this._adapter.setSelectionText(this._adapter.getOptionText(this.selectedIndex));
      this._adapter.notifyValueChange(optionValue);
    }
  }
  
  setDisabled(shouldDisable) {
    if (shouldDisable) {
      this._adapter.makeUntabbable();
      this._adapter.setAttr('aria-disabled', 'aria-disabled');
      this._isDisabled = true;
    } else {
      this._adapter.makeTabbable();
      this._adapter.removeAttr('aria-disabled');
      this._isDisabled = false;
    }
  }

  _bodyClickHandler() {
    this.close();
  }

  _rootKeydownHandler(evt) {
    if (this._isDisabled) {
      return;
    }

    switch (evt.keyCode) {
      case KeyCode.ENTER:
      case KeyCode.SPACE: {
        this.toggle();
        break;
      }

      case KeyCode.TAB: {
        if (this.isOpen) {
          evt.preventDefault();
        }
        break;
      }

      case KeyCode.DOWN: {
        const { selectedIndex } = this;
        const nextIndex = selectedIndex + 1;
        const effectiveIndex = nextIndex >= this._adapter.getOptionsLength()
          ? 0
          : nextIndex;
        this.setSelectedOptionIndex(effectiveIndex);
        this.open();
        break;
      }

      case KeyCode.UP: {
        const { selectedIndex } = this;
        const nextIndex = selectedIndex - 1;
        const effectiveIndex = nextIndex < 0
          ? this._adapter.getOptionsLength() - 1
          : nextIndex;
        this.setSelectedOptionIndex(effectiveIndex);
        this.open();
        break;
      }
    }
  }
}

DropdownFoundation.OPEN_CLASS_NAME = 'dropdown--open';