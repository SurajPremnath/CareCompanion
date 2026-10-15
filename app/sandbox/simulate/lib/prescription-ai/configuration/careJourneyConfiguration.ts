import type {
    ConfigurableRestPanel,
} from "./displayConfiguration";


// ============================================================
// CareVR — Care Journey Configuration
// ============================================================
//
// Represents the display configuration selected by the user
// when entering a Care Journey.
//
// This configuration controls DISPLAY only.
//
// It does NOT control:
// - document extraction
// - AI understanding
// - document classification
// - temporary classification
// - database persistence
//
// Once the Care Journey starts, the configuration is locked
// for that Care Journey session.
// ============================================================

export interface CareJourneyDisplayConfiguration {

    configurable_Rest:
        ConfigurableRestPanel[];

    locked:
        boolean;
}

// ============================================================
// Create Configuration
// ============================================================

export function createCareJourneyConfiguration(
    configurable_Rest:
        ConfigurableRestPanel[]
):
    CareJourneyDisplayConfiguration {

    return {

        configurable_Rest: [
            ...new Set(configurable_Rest),
        ],

        locked: false,

    };

}


// ============================================================
// Lock Configuration
// ============================================================

export function lockCareJourneyConfiguration(
    configuration:
        CareJourneyDisplayConfiguration
):
    CareJourneyDisplayConfiguration {

return {

    configurable_Rest: [
        ...configuration.configurable_Rest,
    ],

    locked: true,

};

}


