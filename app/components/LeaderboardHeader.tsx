"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";

export default function LeaderboardHeader() {
    const [city, setCity] = useState("Local");

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`,
                        {
                            headers: {
                                "Accept-Language": "en",
                            },
                        }
                    );
                    const data = await res.json();
                    const cityName = data.address.city || data.address.town || data.address.state_district || "Local";
                    setCity(cityName);
                } catch (err) {
                    console.error("Failed to fetch city name");
                }
            });
        }
    }, []);

    return (
        <header className="text-center mb-10">
            <div className="inline-block p-3 bg-amber-100 rounded-2xl mb-4">
                <Trophy className="text-amber-600" size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                {city} Heroes
            </h1>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">
                Top Contributors
            </p>
        </header>
    );
}