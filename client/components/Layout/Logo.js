import React, { PropTypes } from 'react';

function Logo({ width, height, ...other }) {
  return (
    <svg
      viewBox="0 0 500 516.813"
      width={width || ((height * 500) / 516.813)}
      height={height || ((width * 500) / 516.813)} {...other}
    >
      <path d="M162 429 c-45 -22 -83 -65 -101 -112 -8 -19 -17 -27 -36 -27 -23 0
      -25 -4 -25 -40 0 -36 3 -40 25 -40 19 0 28 -8 40 -37 36 -85 106 -127 201
      -121 76 5 125 38 164 111 18 35 31 47 48 47 19 0 22 5 22 40 0 36 -3 40 -25
      40 -19 0 -28 8 -40 37 -45 107 -169 153 -273 102z m142 -63 c31 -13 66 -49 66
      -68 0 -5 -54 -8 -120 -8 -66 0 -120 3 -120 8 1 15 36 52 65 66 37 20 66 20
      109 2z m66 -164 c0 -34 -70 -82 -120 -82 -50 0 -120 48 -120 82 0 5 54 8 120
      8 66 0 120 -3 120 -8z" stroke="#fff" fill="#fff"/>
    </svg>
  );
}

Logo.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default Logo;
