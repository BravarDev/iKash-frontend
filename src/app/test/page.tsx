"use client";

import { useOffers } from "@/features/offer/hooks/useOffers";

export default function Test() {
    const { offers } = useOffers();
    console.log(offers)

    return (
        <h1>Test</h1>
    );
}