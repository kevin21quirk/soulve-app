
import React from 'react';
import { RealConnections } from '../RealConnections';

const RealDiscoverConnectTab = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Discover & Connect</h1>
          <p className="text-gray-600 mt-2">Build meaningful connections within your community</p>
        </div>
      </div>
      
      <RealConnections />
    </div>
  );
};

export default RealDiscoverConnectTab;
