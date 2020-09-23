"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ink = require("ink");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Item = ({
  isHighlighted,
  label
}) => /*#__PURE__*/_react.default.createElement(_ink.Text, {
  color: isHighlighted ? 'blue' : undefined
}, label);

Item.propTypes = {
  isHighlighted: _propTypes.default.bool,
  label: _propTypes.default.string.isRequired
};
Item.defaultProps = {
  isHighlighted: false
};
var _default = Item;
exports.default = _default;