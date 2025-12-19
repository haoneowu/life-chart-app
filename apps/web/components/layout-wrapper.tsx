'use client';

import React from 'react';
import { Sidebar } from "@/components/sidebar";
import { Starfield } from "@/components/starfield";
import { BottomTabBar } from "@/components/bottom-tab-bar";
import { useSidebar } from "@/context/sidebar-context";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const { isVisible } = useSidebar();
    return (
        <div className="bg-black min-h-screen text-white">
            <Starfield />
            <Sidebar />
            <div className={`transition-all duration-300 min-h-screen relative z-10 
                ${isVisible ? 'lg:pl-20' : ''} 
                pb-24 md:pb-0`}>
                {children}
            </div>
            <BottomTabBar />
        </div>
    );
}
