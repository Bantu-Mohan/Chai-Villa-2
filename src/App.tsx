import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import DashboardLayout from './components/DashboardLayout/DashboardLayout';
import TableGrid from './components/TableGrid/TableGrid';
import OrderModal from './components/OrderModal/OrderModal';
import Notifications from './components/Notifications/Notifications';
import CustomerView from './components/CustomerView/CustomerView';

// Sound effect hook
const NotificationSound = () => {
  const { state, dispatch } = useApp();
  const previousTables = React.useRef(state.tables);

  useEffect(() => {
    Object.keys(state.tables).forEach(key => {
      const current = state.tables[key];
      const prev = previousTables.current[key];

      // Detect switch to ORDERED
      // We check for:
      // 1. Status changed to ORDERED
      // 2. OR Status is ORDERED and items length changed (customer added more items?) - requirements say "Until CASH confirmed, no further orders". 
      //    So strictly, we just care about the initial transition to ORDERED.
      if (current.status === 'ORDERED' && (!prev || prev.status !== 'ORDERED')) {
        // Play Sound
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3');
        audio.play().catch(e => console.log("Audio play failed", e));

        // Show Notification
        dispatch({ type: 'ADD_NOTIFICATION', payload: `Table ${key} has placed an order!` });
      }
    });

    // Update ref
    previousTables.current = state.tables;
  }, [state.tables, dispatch]);

  return null;
};

const MainContent: React.FC = () => {
  const [tableId, setTableId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tid = params.get('table');
    if (tid) setTableId(tid);
  }, []);

  if (tableId) {
    return <CustomerView tableId={tableId} />;
  }

  return (
    <>
      <DashboardLayout>
        <TableGrid />
      </DashboardLayout>
      <OrderModal />
      <Notifications />
      <NotificationSound />
    </>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;
