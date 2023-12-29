import Nominatim, { NominatimSearchResult } from '@/utils/geocoding/nominatim'
import DataGouv, { IDataGouvSearchResult } from './adresseDataGouv'

function extractPostcode(displayName: string): string | null {
    const match = displayName.match(/\b\d{5}\b/) // Find a sequence of 5 digits
    return match ? match[0] : null // If found, return the sequence. Otherwise, return null.
}

export interface ReverseParams {
    addressdetails?: string
    format?: string
    lat: number
    lon: number
}

export interface GeocodeAddressSuggestion {
    formattedAddress: string
    postcode: string | null
    lat: number
    lng: number
}

function isNumeric(x: string) {
    return parseFloat(x).toString() === x.toString()
}

export default class Geocoding {
    /*
     * To use a geolocating server or another
     * (e.g. adresse.gouv.fr for french addresses => use project.country.numeric in options)
     */
    static async geocode(
        query: string,
        options: { countryCode?: number } = { countryCode: 250 }
    ): Promise<GeocodeAddressSuggestion[]> {
        // dealing with addresses that have numbers only
        if (isNumeric(query)) {
            return []
        }

        // dealing with French addresses separately (using adresse.gouv.fr)
        if (options?.countryCode === 250) {
            let results = await DataGouv.search({ q: query })

            return results.map((suggestedAddress: IDataGouvSearchResult) => ({
                type: suggestedAddress.type,
                formattedAddress: suggestedAddress.label,
                postcode: suggestedAddress.properties.postcode,
                lng: suggestedAddress.x,
                lat: suggestedAddress.y,
            }))
        }

        // for other cases: using nominatim's API
        let results = await Nominatim.search({ q: query })
        return results.map((nominatimSuggestion: NominatimSearchResult) => ({
            type: nominatimSuggestion.type,
            formattedAddress: nominatimSuggestion.display_name,
            postcode: nominatimSuggestion.address.postcode,
            lng: parseFloat(nominatimSuggestion.lon),
            lat: parseFloat(nominatimSuggestion.lat),
        }))
    }

    static async reverse(
        coordinates: ReverseParams,
        options?: { countryCode?: number }
    ): Promise<GeocodeAddressSuggestion> {
        if (options?.countryCode === 250) {
            let response = await DataGouv.reverse({ lat: coordinates.lat, lon: coordinates.lon })
            return {
                formattedAddress: response.label,
                postcode: response.properties.postcode,
                lat: coordinates.lat,
                lng: coordinates.lon,
            }
        }

        // for other cases: using nominatim's API
        let response = await Nominatim.reverse({
            addressdetails: 0,
            format: 'json',
            lat: coordinates.lat,
            lon: coordinates.lon,
        })

        return {
            formattedAddress: response.display_name,
            postcode: extractPostcode(response.display_name),
            lat: coordinates.lat,
            lng: coordinates.lon,
        }
    }
}
