"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    OfferFilters,
    DEFAULT_FILTERS,
    FilterValidationErrors,
} from "../types/offer-filter.types";
import {
    parseFiltersFromURL,
    filtersToURLParams,
    validateFilters,
} from "../utils/build-offer-query";

interface UseOfferFiltersReturn {
    filters: OfferFilters;
    draftFilters: OfferFilters;        // for mobile drawer (uncommitted)
    errors: FilterValidationErrors;
    activeFilterCount: number;
    setFilter: <K extends keyof OfferFilters>(key: K, value: OfferFilters[K]) => void;
    setDraftFilter: <K extends keyof OfferFilters>(key: K, value: OfferFilters[K]) => void;
    applyDraftFilters: () => void;
    clearFilters: () => void;
    isFiltersDefault: boolean;
}

export function useOfferFilters(): UseOfferFiltersReturn {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialise from URL on mount
    const initialFilters = parseFiltersFromURL(searchParams);
    const [filters, setFilters] = useState<OfferFilters>(initialFilters);

    // Draft state for the mobile drawer (apply on confirm)
    const [draftFilters, setDraftFilters] = useState<OfferFilters>(initialFilters);

    // Validation errors
    const [errors, setErrors] = useState<FilterValidationErrors>({});

    // Sync URL → state when the user navigates back/forward
    const prevSearchRef = useRef(searchParams.toString());
    useEffect(() => {
        const current = searchParams.toString();
        if (current !== prevSearchRef.current) {
            prevSearchRef.current = current;
            const parsed = parseFiltersFromURL(searchParams);
            setFilters(parsed);
            setDraftFilters(parsed);
        }
    }, [searchParams]);

    // Push filters to URL
    const pushToURL = useCallback(
        (next: OfferFilters) => {
            const qs = filtersToURLParams(next);
            const newPath = qs ? `?${qs}` : "?";
            router.replace(newPath, { scroll: false });
        },
        [router]
    );

    // Set a single filter key and immediately push to URL
    const setFilter = useCallback(
        <K extends keyof OfferFilters>(key: K, value: OfferFilters[K]) => {
            setFilters((prev) => {
                const next = { ...prev, [key]: value };
                const errs = validateFilters(next);
                setErrors(errs);
                if (Object.keys(errs).length === 0) {
                    pushToURL(next);
                }
                return next;
            });
        },
        [pushToURL]
    );

    // Set a single draft key (mobile drawer — doesn't push to URL yet)
    const setDraftFilter = useCallback(
        <K extends keyof OfferFilters>(key: K, value: OfferFilters[K]) => {
            setDraftFilters((prev) => {
                const next = { ...prev, [key]: value };
                const errs = validateFilters(next);
                setErrors(errs);
                return next;
            });
        },
        []
    );

    // Commit draft → live and push to URL
    const applyDraftFilters = useCallback(() => {
        const errs = validateFilters(draftFilters);
        setErrors(errs);
        if (Object.keys(errs).length === 0) {
            setFilters(draftFilters);
            pushToURL(draftFilters);
        }
    }, [draftFilters, pushToURL]);

    // Reset everything
    const clearFilters = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
        setDraftFilters(DEFAULT_FILTERS);
        setErrors({});
        router.replace("?", { scroll: false });
    }, [router]);

    // Computed helpers
    const activeFilterCount = [
        filters.paymentMethod,
        filters.asset,
        filters.minAmount,
        filters.maxAmount,
        filters.sort !== "best_match" ? filters.sort : "",
    ].filter(Boolean).length;

    const isFiltersDefault =
        filters.paymentMethod === DEFAULT_FILTERS.paymentMethod &&
        filters.asset === DEFAULT_FILTERS.asset &&
        filters.minAmount === DEFAULT_FILTERS.minAmount &&
        filters.maxAmount === DEFAULT_FILTERS.maxAmount &&
        filters.sort === DEFAULT_FILTERS.sort;

    return {
        filters,
        draftFilters,
        errors,
        activeFilterCount,
        setFilter,
        setDraftFilter,
        applyDraftFilters,
        clearFilters,
        isFiltersDefault,
    };
}
