"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import type {
    MedicineMaster,
} from "@/lib/medication/types/medicineMaster";

import {
    MedicineResolverImpl,
} from "@/lib/medication/resolver/MedicineResolverImpl";

interface MedicineSearchProps {

    medicineName: string;

    selectedDose: string;

    disabled?: boolean;

    placeholder?: string;

    onMedicineSelected: (

        medicineName: string,

        selectedDose: string

    ) => void;

}

export default function MedicineSearch({

    medicineName,

    selectedDose,

    disabled = false,

    placeholder = "Search medicine...",

    onMedicineSelected,

}: MedicineSearchProps) {

    const resolver = useMemo(
        () => new MedicineResolverImpl(),
        []
    );

    const [

        searchText,

        setSearchText,

    ] = useState(medicineName);

const [

    debouncedSearch,

    setDebouncedSearch,

] = useState(medicineName);

    const [

        suggestions,

        setSuggestions,

    ] = useState<MedicineMaster[]>([]);

    const [

        availableDoses,

        setAvailableDoses,

    ] = useState<string[]>([]);

    const [

        dose,

        setDose,

    ] = useState(selectedDose);

    useEffect(() => {

        setSearchText(medicineName);

    }, [medicineName]);

    useEffect(() => {

        setDose(selectedDose);

    }, [selectedDose]);

useEffect(() => {

    const timer = setTimeout(() => {

        setDebouncedSearch(searchText);

    }, 300);

    return () => clearTimeout(timer);

}, [searchText]);


useEffect(() => {

    if (!medicineName.trim()) {

        setAvailableDoses([]);

        return;

    }

    async function loadDoses() {

        const doses =
            await resolver.getStrengthsByBrandName(
                medicineName
            );

        setAvailableDoses(doses);

    }

    loadDoses();

}, [

    medicineName,

    resolver,

]);

    return (

        <>

<div
    style={{
        position: "relative",
        width: "100%",
    }}
>

        <input
            type="text"
            value={searchText}
            placeholder={placeholder}
            disabled={disabled}
            onChange={async (event) => {

                const value =
                    event.target.value;

                setSearchText(value);

                if (
                    value.trim().length < 2
                ) {

                    setSuggestions([]);

                    setAvailableDoses([]);

                    setDose("");

                    onMedicineSelected(
                        "",
                        ""
                    );

                    return;

                }

                const results =
                    await resolver.search(value);

                const uniqueMedicines =
                    results.filter(
                        (
                            medicine,
                            index,
                            array
                        ) =>

                            index ===
                            array.findIndex(
                                item =>
                                    item.brandName ===
                                    medicine.brandName
                            )
                    );

                setSuggestions(
                    uniqueMedicines
                );

            }}

            style={searchInput}
        />

        {

            suggestions.length > 0 && (

                <div style={suggestionContainer}>

                    {

                        suggestions.map(item => (

                            <button

                                key={item.id}

                                type="button"

                                style={suggestionButton}

                                onClick={async () => {

                                    setSearchText(
                                        item.brandName
                                    );

                                    setSuggestions([]);

const doses =
    await resolver.getStrengthsByBrandName(
        item.brandName
    );

setSuggestions([]);

onMedicineSelected(
    item.brandName,
    ""
);

                                }}

                            >

                                <strong>

                                    {item.brandName}

                                </strong>

                            </button>

                        ))

                    }

                </div>

            )

        }

    </div>


        </>

    );

}

const searchInput: React.CSSProperties = {

    width: "100%",

    padding: "8px",

    border: "1px solid #CBD5E1",

    borderRadius: "6px",

    fontSize: "14px",

    background: "#FFFFFF",

    boxSizing: "border-box",

};

const suggestionContainer: React.CSSProperties = {

    display: "flex",

    flexDirection: "column",

    marginTop: "8px",

    border: "1px solid #E5E7EB",

    borderRadius: "6px",

    background: "#FFFFFF",

    overflow: "hidden",

    position: "absolute",

    top: "100%",

    left: 0,

    right: 0,

    zIndex: 1000,

    boxShadow:
        "0 6px 18px rgba(0,0,0,0.12)",

};

const suggestionButton: React.CSSProperties = {

    padding: "10px 12px",

    textAlign: "left",

    border: "none",

    borderBottom:
        "1px solid #E5E7EB",

    background: "#FFFFFF",

    cursor: "pointer",

    fontSize: "14px",

};