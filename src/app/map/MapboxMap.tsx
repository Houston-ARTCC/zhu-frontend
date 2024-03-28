'use client';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import MapboxGl, { type MapLayerMouseEvent } from 'mapbox-gl';
import { createRoot } from 'react-dom/client';
import { useTheme } from 'next-themes';
import { type Metar } from '@/types/tmu';

MapboxGl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_APIK as string;

const FLIGHT_RULE_COLORS = {
    VFR: 'text-green-500',
    MVFR: 'text-sky-500',
    IFR: 'text-yellow-500',
    LIFR: 'text-red-400',
};

interface MapboxMapProps {
    metars: Metar[];
}

export const MapboxMap: React.FC<MapboxMapProps> = ({ metars }) => {
    const { resolvedTheme } = useTheme();

    const containerRef = useRef<HTMLDivElement>(null);

    const mapRef = useRef<MapboxGl.Map>();
    const popupRef = useRef<MapboxGl.Popup>();
    const popupDomRef = useRef<HTMLDivElement>();

    const metarMap = useMemo(() => new Map(metars.map((metar) => ([metar.station, metar]))), [metars]);

    const createPopup = useCallback((event: MapLayerMouseEvent) => {
        if (!event.features || !mapRef.current) return;
        const feature = event.features[0];
        const metar = metarMap.get(feature.properties?.icao);

        popupDomRef.current = document.createElement('div');
        createRoot(popupDomRef.current).render(
            <div className="w-96 px-1 font-sans">
                <h4 className="text-xl font-medium">{feature.properties?.icao}</h4>
                <h5 className="mb-4 text-base">{feature.properties?.name}</h5>
                {metar ? (
                    <code><b className={FLIGHT_RULE_COLORS[metar.flight_rules]}>({metar.flight_rules})</b> {metar.raw}</code>
                ) : (
                    <p>METAR Unavailable</p>
                )}
            </div>,
        );

        popupRef.current?.remove();
        popupRef.current = new MapboxGl.Popup({ closeButton: false })
            .setLngLat((feature.geometry as GeoJSON.Point).coordinates as MapboxGl.LngLatLike)
            .setDOMContent(popupDomRef.current)
            .addTo(mapRef.current);
    }, [metarMap]);

    const destroyPopup = useCallback(() => {
        popupRef.current?.remove();
        popupRef.current = undefined;

        popupDomRef.current?.remove();
        popupDomRef.current = undefined;
    }, [popupRef, popupDomRef]);

    useEffect(() => {
        if (containerRef.current && !mapRef.current) {
            mapRef.current = new MapboxGl.Map({
                container: containerRef.current,
                style: resolvedTheme === 'light'
                    ? 'mapbox://styles/mikeroma/cknyy7hnt32ch17n1u1d7xon4'
                    : 'mapbox://styles/mikeroma/cknyyool032px17n1ljciyroy',
                center: [-94, 28],
                zoom: 5.5,
            });
            mapRef.current.on('mouseenter', 'houston-artcc-airports', createPopup);
            mapRef.current.on('mouseleave', 'houston-artcc-airports', destroyPopup);
        }

        return () => {
            mapRef.current?.remove();
            mapRef.current = undefined;

            destroyPopup();
        };
    }, [resolvedTheme, createPopup, destroyPopup]);

    return (
        <div className="h-[700px]" ref={containerRef} />
    );
};
