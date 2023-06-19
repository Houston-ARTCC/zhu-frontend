'use client';

import React from 'react';
import { ToastContainer } from 'react-toastify';

export const Toastify: React.FC = () => (
    <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        theme="colored"
    />
);
