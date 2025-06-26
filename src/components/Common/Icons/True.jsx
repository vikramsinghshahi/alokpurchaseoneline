import React, { PureComponent } from 'react';
import { string } from 'prop-types';

export default class True extends PureComponent {
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
        stroke="#006400"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-check"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
}
