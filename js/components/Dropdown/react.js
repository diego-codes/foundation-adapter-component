import DropdownFoundation from './foundation';

export default class ReactDropdown extends React.Component {
  getDefaultFoundation() {
    return new DropdownFoundation({
      registerInteractionHandler: (eventType, handler) => this._root.addEventListener(eventType, handler),
      deRegisterInteractionHandler: (eventType, handler) => this._root.removeEventListener(eventType, handler),
      registerBodyInteractionHandler: (eventType, handler) => window.addEventListener(eventType, handler),
      deRegisterBodyInteractionHandler: (eventType, handler) => window.removeEventListener(eventType, handler),
      setAttr: (attribute, value) => this._changeState,
      removeAttr: (attribute) => this._changeState(attribute, null),
      addClass: (className) => { 
        const classes = [...this.state.classes, className];
        this._changeState('classes', classes);
      },
      removeClass: (className) => {
        const classes = this.state.classes.filter((cls) => cls !== className);
        this._changeState('classes', classes);
      },
      containsClass: (className) => this.state.classes.indexOf(className) > -1,
      getElementAttribute: (element, attribute) => element.getAttribute(attribute),
      setOptionAttr: (index, attribute, value) => {
        const optionsAttrs = [...this.state.optionAttributes];
        optionsAttrs[index] = {...optionsAttrs[index]};
        optionsAttrs[index][attribute] = value;
        this.setState({optionAttributes: optionsAttrs});
      },
      removeOptionAttr: (index, attribute) => {
        const optionsAttrs = [...this.state.optionAttributes];
        optionsAttrs[index] = {...optionsAttrs[index]};
        optionsAttrs[index][attribute] = null;
        this.setState({optionAttributes: optionsAttrs});
      },
      getOptionIndex: (element) => this.props.options.indexOf(element.textContent),
      getOptionText: (index) => this.props.options[index],
      getOptionValue: (index) => this.props.options[index],
      getOptionsLength: () => this.props.options.length,
      setSelectionText: (text) => this.setState({selectionText: text}),
      makeTabbable: () =>  this.setState({ tabIndex: 0 }),
      makeUntabbable: () => this.setState({ tabIndex: null }),
      notifyValueChange: (value) => this.props.onValueChange(value),
    });
  }
  
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      selectedIndex: this.props.selectedIndex,
      selectionText: 'Make a selection',
      classes: [],
      optionAttributes: this.props.options.map(() => {}),
    }
    
    this.state['aria-disabled'] = this.props.disabled;
    
    this._foundation = this.getDefaultFoundation(); 
  }
  
  componentDidMount() {
    this._foundation.setSelectedOptionIndex(this.state.selectedIndex);
    this._foundation.disabled = this.state['aria-disabled'];
    this._foundation.init();
  }
  componentWillUnmount() {
    this._foundation.destroy();
  }
  
  _changeState(key, value) {
    const newState = {};
    newState[key] = value;
    
    this.setState(newState);
  }
  
  render() {
    const { tabIndex, selectedIndex, optionAttributes } = this.state;
    
    return (
      <div
        className={`dropdown ${this.state.classes.join(' ')}`}
        role="listbox"
        tabIndex={tabIndex}
        ref={(root) => this._root = root}
        aria-disabled={this.state['aria-disabled']}
      >
        <div className="dropdown__button">
          <span className="dropdown__selection">
            {this.state.selectionText}
          </span>
          <svg className="dropdown__arrow" viewBox="0 0 5 5">
            <path d="M1,1.5 l1.5,1 1.5,-1" />
          </svg>
        </div>
        <ul className="dropdown__options">
          { this.props.options.map((option, optionIndex) => {
            return (
              <li 
                role="option" 
                className="dropdown__option" 
                id="{option}" 
                aria-selected={optionIndex === selectedIndex || null}
                {...optionAttributes[optionIndex]}
              >
                {option}
              </li>
          )})}
        </ul>
      </div>
    );
  }
}