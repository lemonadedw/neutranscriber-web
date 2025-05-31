import React, { useState, useEffect, useCallback } from 'react';
import { DEFAULT_SERVERS } from '../utils/constants';

const ServerSelector = ({ onServerSelect, selectedServer }) => {
    const [servers, setServers] = useState(DEFAULT_SERVERS);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const checkServerHealth = useCallback(async (server) => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(server.healthUrl, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                return data.status === 'ok' ? 'online' : 'error';
            }
            return 'error';
        } catch (error) {
            return 'offline';
        }
    }, []);

    const updateServerStatus = useCallback(async () => {
        const updatedServers = await Promise.all(
            servers.map(async (server) => {
                const status = await checkServerHealth(server);
                return { ...server, status };
            })
        );
        setServers(updatedServers);
    }, [servers, checkServerHealth]);

    useEffect(() => {
        updateServerStatus();
        const interval = setInterval(updateServerStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleServerSelect = useCallback((server) => {
        onServerSelect(server);
        setIsDropdownOpen(false);
    }, [onServerSelect]);

    const getStatusColor = (status) => {
        const colors = {
            online: 'bg-green-500 shadow-green-500/50',
            offline: 'bg-red-500 shadow-red-500/50',
            error: 'bg-red-500 shadow-red-500/50',
            checking: 'bg-yellow-500 shadow-yellow-500/50 animate-pulse'
        };
        return colors[status] || 'bg-gray-400';
    };

    const getStatusText = (status) => {
        const statusTexts = {
            online: 'Online',
            offline: 'Offline',
            error: 'Error',
            checking: 'Checking...'
        };
        return statusTexts[status] || 'Unknown';
    };

    const getStatusBadgeColor = (status) => {
        const colors = {
            online: 'bg-green-100 text-green-700',
            checking: 'bg-yellow-100 text-yellow-700',
            offline: 'bg-red-100 text-red-700',
            error: 'bg-red-100 text-red-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="fixed top-3 left-3 lg:top-5 lg:left-5 z-50">
            <div className="relative">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-white/90 backdrop-blur-sm text-slate-700 border border-white/30 py-2 px-3 lg:py-3 lg:px-4 rounded-xl text-xs lg:text-sm font-semibold cursor-pointer transition-all duration-300 flex items-center gap-2 shadow-lg hover:bg-white hover:shadow-xl"
                    title="Select server"
                >
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedServer?.status || 'checking')} transition-all duration-300`}></div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="lg:w-5 lg:h-5">
                        <path d="M4,1H20A1,1 0 0,1 21,2V6A1,1 0 0,1 20,7H4A1,1 0 0,1 3,6V2A1,1 0 0,1 4,1M4,9H20A1,1 0 0,1 21,10V14A1,1 0 0,1 20,15H4A1,1 0 0,1 3,14V10A1,1 0 0,1 4,9M4,17H20A1,1 0 0,1 21,18V22A1,1 0 0,1 20,23H4A1,1 0 0,1 3,22V18A1,1 0 0,1 4,17Z" />
                    </svg>
                    <span className="hidden sm:inline lg:inline">Server</span>
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    >
                        <path d="M7,10L12,15L17,10H7Z" />
                    </svg>
                </button>

                {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-72 bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl rounded-xl z-50 animate-slide-in-from-top">
                        <div className="p-3">
                            <h3 className="text-sm font-bold text-slate-800 mb-3 px-2">Select Backend Server</h3>
                            <div className="space-y-2">
                                {servers.map((server) => (
                                    <button
                                        key={server.id}
                                        onClick={() => handleServerSelect(server)}
                                        className={`w-full p-3 rounded-lg text-left transition-all duration-300 hover:bg-slate-50 border ${selectedServer?.id === server.id
                                                ? 'border-blue-200 bg-blue-50'
                                                : 'border-transparent'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded-full ${getStatusColor(server.status)} shadow-lg transition-all duration-300`}></div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-semibold text-slate-800 truncate">
                                                        {server.name}
                                                    </h4>
                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadgeColor(server.status)}`}>
                                                        {getStatusText(server.status)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 truncate mt-1">
                                                    {server.url}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <div className="border-t border-slate-200 mt-3 pt-3">
                                <button
                                    onClick={updateServerStatus}
                                    className="w-full p-2 text-xs text-slate-600 hover:text-slate-800 transition-colors duration-300 flex items-center justify-center gap-2"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
                                    </svg>
                                    Refresh Status
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Click outside to close */}
            {isDropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                />
            )}
        </div>
    );
};

export default ServerSelector;