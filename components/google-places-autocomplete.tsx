'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api'
import { MapPin, Loader2, AlertCircle } from 'lucide-react'

const LIBRARIES: ('places')[] = ['places']

interface PlaceResult {
  formatted_address: string
  lat: number
  lng: number
  place_id: string
}

interface GooglePlacesAutocompleteProps {
  value: string
  onChange: (address: string, placeResult?: PlaceResult) => void
  placeholder?: string
  className?: string
}

export function GooglePlacesAutocomplete({
  value,
  onChange,
  placeholder = 'Start typing an address…',
  className = '',
}: GooglePlacesAutocompleteProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [inputValue, setInputValue] = useState(value)

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES,
  })

  // Sync external value
  useEffect(() => {
    setInputValue(value)
  }, [value])

  const onLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete
  }, [])

  const onPlaceChanged = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace()
      if (place?.formatted_address) {
        const result: PlaceResult = {
          formatted_address: place.formatted_address,
          lat: place.geometry?.location?.lat() ?? 0,
          lng: place.geometry?.location?.lng() ?? 0,
          place_id: place.place_id ?? '',
        }
        setInputValue(place.formatted_address)
        onChange(place.formatted_address, result)
      } else if (place?.name) {
        setInputValue(place.name)
        onChange(place.name)
      }
    }
  }, [onChange])

  const inputCls = `w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-lg pl-9 pr-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#0763d8]/60 transition-colors ${className}`

  // API key not configured — fallback to plain text input
  if (!apiKey) {
    return (
      <div className="relative">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            value={inputValue}
            onChange={e => { setInputValue(e.target.value); onChange(e.target.value) }}
            placeholder={placeholder}
            className={inputCls}
          />
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <AlertCircle className="w-3 h-3 text-amber-400/60" />
          <p className="text-[10px] text-amber-400/60">
            Set <code className="bg-white/[0.04] px-1 py-0.5 rounded text-[9px]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in <code className="bg-white/[0.04] px-1 py-0.5 rounded text-[9px]">.env.local</code> for autocomplete
          </p>
        </div>
      </div>
    )
  }

  // Loading state
  if (!isLoaded) {
    return (
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <input
          type="text"
          value={inputValue}
          onChange={e => { setInputValue(e.target.value); onChange(e.target.value) }}
          placeholder="Loading Google Maps…"
          disabled
          className={inputCls + ' opacity-50 cursor-wait'}
        />
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 animate-spin" />
      </div>
    )
  }

  // Load error
  if (loadError) {
    return (
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <input
          type="text"
          value={inputValue}
          onChange={e => { setInputValue(e.target.value); onChange(e.target.value) }}
          placeholder={placeholder}
          className={inputCls}
        />
        <p className="text-[10px] text-red-400/60 mt-1.5">⚠ Google Maps failed to load. You can type the address manually.</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400/60 z-10" />
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          types: ['address'],
          fields: ['formatted_address', 'geometry', 'place_id', 'name'],
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => { setInputValue(e.target.value); onChange(e.target.value) }}
          placeholder={placeholder}
          className={inputCls}
        />
      </Autocomplete>
      <p className="text-[10px] text-teal-400/40 mt-1.5 flex items-center gap-1">
        <MapPin className="w-3 h-3" /> Powered by Google Maps
      </p>
    </div>
  )
}
