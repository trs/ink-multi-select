"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Indicator", {
  enumerable: true,
  get: function () {
    return _indicator.default;
  }
});
Object.defineProperty(exports, "Item", {
  enumerable: true,
  get: function () {
    return _item.default;
  }
});
Object.defineProperty(exports, "CheckBox", {
  enumerable: true,
  get: function () {
    return _checkbox.default;
  }
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = _interopRequireDefault(require("lodash.isequal"));

var _arrRotate = _interopRequireDefault(require("arr-rotate"));

var _ink = require("ink");

var _indicator = _interopRequireDefault(require("./indicator"));

var _item = _interopRequireDefault(require("./item"));

var _checkbox = _interopRequireDefault(require("./checkbox"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const ARROW_UP = '\u001B[A';
const ARROW_DOWN = '\u001B[B';
const ENTER = '\r';
const SPACE = ' ';

class MultiSelect extends _react.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      rotateIndex: 0,
      highlightedIndex: this.props.initialIndex,
      selected: this.props.selected || this.props.defaultSelected
    });

    _defineProperty(this, "handleInput", data => {
      const {
        items,
        focus,
        onHighlight,
        onSubmit
      } = this.props;
      const {
        rotateIndex,
        highlightedIndex
      } = this.state;
      const selected = this.props.selected || this.state.selected;
      const {
        limit,
        hasLimit
      } = this;

      if (focus === false) {
        return;
      }

      const s = String(data);

      if (s === ARROW_UP || s === 'k') {
        const lastIndex = (hasLimit ? limit : items.length) - 1;
        const atFirstIndex = highlightedIndex === 0;
        const nextIndex = hasLimit ? highlightedIndex : lastIndex;
        const nextRotateIndex = atFirstIndex ? rotateIndex + 1 : rotateIndex;
        const nextHighlightedIndex = atFirstIndex ? nextIndex : highlightedIndex - 1;
        this.setState({
          rotateIndex: nextRotateIndex,
          highlightedIndex: nextHighlightedIndex
        });
        const slicedItems = hasLimit ? (0, _arrRotate.default)(items, nextRotateIndex).slice(0, limit) : items;
        onHighlight(slicedItems[nextHighlightedIndex]);
      }

      if (s === ARROW_DOWN || s === 'j') {
        const atLastIndex = highlightedIndex === (hasLimit ? limit : items.length) - 1;
        const nextIndex = hasLimit ? highlightedIndex : 0;
        const nextRotateIndex = atLastIndex ? rotateIndex - 1 : rotateIndex;
        const nextHighlightedIndex = atLastIndex ? nextIndex : highlightedIndex + 1;
        this.setState({
          rotateIndex: nextRotateIndex,
          highlightedIndex: nextHighlightedIndex
        });
        const slicedItems = hasLimit ? (0, _arrRotate.default)(items, nextRotateIndex).slice(0, limit) : items;
        onHighlight(slicedItems[nextHighlightedIndex]);
      }

      if (s === SPACE) {
        const slicedItems = hasLimit ? (0, _arrRotate.default)(items, rotateIndex).slice(0, limit) : items;
        const selectedItem = slicedItems[highlightedIndex];
        this.setSelectedState(this.selectItem(selectedItem));
      }

      if (s === ENTER) {
        onSubmit(selected);
      }
    });
  }

  render() {
    const {
      items,
      indicatorComponent,
      itemComponent,
      checkboxComponent
    } = this.props;
    const {
      rotateIndex,
      highlightedIndex
    } = this.state;
    const {
      limit,
      hasLimit
    } = this;
    const slicedItems = hasLimit ? (0, _arrRotate.default)(items, rotateIndex).slice(0, limit) : items;
    return /*#__PURE__*/_react.default.createElement(_ink.Box, {
      flexDirection: "column"
    }, slicedItems.map((item, index) => {
      const key = item.key || item.value;
      const isHighlighted = index === highlightedIndex;
      const isSelected = this.isSelected(item.value);
      return /*#__PURE__*/_react.default.createElement(_ink.Box, {
        key: key
      }, /*#__PURE__*/_react.default.createElement(indicatorComponent, {
        isHighlighted
      }), /*#__PURE__*/_react.default.createElement(checkboxComponent, {
        isSelected
      }), /*#__PURE__*/_react.default.createElement(itemComponent, { ...item,
        isHighlighted
      }));
    }));
  }

  componentDidMount() {
    const {
      stdin,
      setRawMode
    } = this.props; // eslint-disable-line react/prop-types

    setRawMode(true);
    stdin.on('data', this.handleInput);
  }

  componentWillUnmount() {
    const {
      stdin,
      setRawMode
    } = this.props; // eslint-disable-line react/prop-types

    stdin.removeListener('data', this.handleInput);
    setRawMode(false);
  }

  componentDidUpdate(prevProps) {
    if (!(0, _lodash.default)(prevProps.items, this.props.items)) {
      this.setState({
        // eslint-disable-line react/no-did-update-set-state
        rotateIndex: 0,
        highlightedIndex: 0
      });
    }
  }

  isSelected(value) {
    const selected = this.props.selected || this.state.selected;
    return selected.map(({
      value
    }) => value).includes(value);
  }

  selectItem(item) {
    const {
      onSelect,
      onUnselect
    } = this.props;
    const selected = this.props.selected || this.state.selected;

    if (this.isSelected(item.value)) {
      onUnselect(item);
      return selected.filter(({
        value
      }) => {
        return value !== item.value;
      });
    }

    onSelect(item);
    return [...selected, item];
  }

  setSelectedState(selected) {
    this.setState({
      selected
    });
  }

  get hasLimit() {
    const {
      limit,
      items
    } = this.props;
    return typeof limit === 'number' && items.length > limit;
  }

  get limit() {
    const {
      limit,
      items
    } = this.props;

    if (this.hasLimit) {
      return Math.min(limit, items.length);
    }

    return items.length;
  }

}

_defineProperty(MultiSelect, "propTypes", {
  items: _propTypes.default.array,
  selected: _propTypes.default.array,
  defaultSelected: _propTypes.default.array,
  focus: _propTypes.default.bool,
  initialIndex: _propTypes.default.number,
  indicatorComponent: _propTypes.default.func,
  checkboxComponent: _propTypes.default.func,
  itemComponent: _propTypes.default.func,
  limit: _propTypes.default.number,
  onSelect: _propTypes.default.func,
  onUnselect: _propTypes.default.func,
  onSubmit: _propTypes.default.func,
  onHighlight: _propTypes.default.func,
  stdin: _propTypes.default.any.isRequired,
  setRawMode: _propTypes.default.func.isRequired
});

_defineProperty(MultiSelect, "defaultProps", {
  items: [],
  selected: undefined,
  defaultSelected: [],
  focus: true,
  initialIndex: 0,
  indicatorComponent: _indicator.default,
  checkboxComponent: _checkbox.default,
  itemComponent: _item.default,
  limit: null,

  onSelect() {},

  onUnselect() {},

  onSubmit() {},

  onHighlight() {}

});

var _default = props => {
  const {
    stdin,
    setRawMode
  } = (0, _ink.useStdin)();
  return /*#__PURE__*/_react.default.createElement(MultiSelect, _extends({}, props, {
    stdin: stdin,
    setRawMode: setRawMode
  }));
};

exports.default = _default;