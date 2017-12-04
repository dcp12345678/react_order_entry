import React, {Component} from 'react';
import PropTypes from 'prop-types';
import App from '../App';

class AppWrapper extends Component {

  renderChildren() {
    const {children} = this.props;
    if (!children) {
      return null;
    }

    const sharedProps = {
      dummy: {name: 'name1', value: 42},
      dummy2: {name: 'name2', value: 52},
    };
    return React.Children.map(children, (c) => React.cloneElement(c, sharedProps, {
    }));
  }

  render() {
    const child = this.renderChildren();
    return (
      <App>
        {child}
      </App>
    );
  }
}

AppWrapper.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
};

export default AppWrapper;
