'use client';

import React, { createContext, useContext, useState } from 'react';

interface SidebarContextType {
    isVisible: boolean;
    setVisible: (visible: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isVisible, setVisible] = useState(true);

    return (
        <SidebarContext.Provider value={{ isVisible, setVisible }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}
