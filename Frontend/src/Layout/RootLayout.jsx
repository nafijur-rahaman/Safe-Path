import React from 'react';
import { Outlet } from 'react-router';
import HamburgerMenu from '../components/HamburgerMenu';

const RootLayout = () => {
    return (
        <div>
            <div>
                <HamburgerMenu />
            </div>
            <div>
            <Outlet></Outlet>
            </div>
        </div>
    );
};

export default RootLayout;