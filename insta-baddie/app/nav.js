import React from 'react';
import './nav.css';

function Nav() {
    return (
        <div className="nav-container">
            <div className="nav-bar">
                <a href="/feed" className="nav-item nav-button">Feed</a>
                <a href="/account" className="nav-item nav-button">Account Settings</a>
                <a href="/profile" className="nav-item nav-button">Profile</a>
            </div>
        </div>
    );
}

export default Nav;