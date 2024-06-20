import React from 'react';
import logo from '../assets/react.svg';

function Logo({ width = '100px' }) {
    return (
        <img
            src={logo}
            alt="React Logo"
            style={{ width }}
        />
    );
}

export default Logo;
