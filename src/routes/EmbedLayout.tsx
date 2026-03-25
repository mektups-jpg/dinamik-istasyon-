import React from 'react';
import { Outlet } from 'react-router-dom';

export default function EmbedLayout() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0B0C10]">
      {/* 
        This layout is completely empty except for the Outlet.
        It ensures that when embedded in an iframe, there are no scrollbars,
        no headers, and no navigation menus. Just the pure simulation.
      */}
      <Outlet />
    </div>
  );
}
