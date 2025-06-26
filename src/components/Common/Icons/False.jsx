import React, { PureComponent } from 'react';
import { string } from 'prop-types';

export default class False extends PureComponent {
  static propTypes = {
    width: string,
    height: string,
  };

  static defaultProps = {
    width: '16',
    height: '16',
  };

  render() {
    const { width, height } = this.props;
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#D0021B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-x"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  }
}
