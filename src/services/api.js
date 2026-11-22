import axios from 'axios'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org'
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

// ─── 1. Geocode location name → coords ──────────────────────────────────────
export const geocodeLocation = async (locationName) => {
  try {
    const response = await axios.get(`${NOMINATIM_URL}/search`, {
      params: {
        q: locationName,
        format: 'json',
        limit: 1,
        addressdetails: 1
      },
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'SmartServiceFinder/1.0 (student-project)'
      }
    })

    console.log('Nominatim response:', response.data)

    if (!response.data || response.data.length === 0) {
      throw new Error(`Location "${locationName}" not found. Try a more specific name.`)
    }

    const { lat, lon } = response.data[0]
    return { lat: parseFloat(lat), lon: parseFloat(lon) }

  } catch (err) {
    console.error('Geocoding error:', err)
    throw new Error(err.message || 'Failed to find location.')
  }
}

// ─── 2. Service type → Overpass tag ─────────────────────────────────────────
const SERVICE_TAGS = {
  hospital:   { key: 'amenity', value: 'hospital' },
  pharmacy:   { key: 'amenity', value: 'pharmacy' },
  atm:        { key: 'amenity', value: 'atm' },
  police:     { key: 'amenity', value: 'police' },
  restaurant: { key: 'amenity', value: 'restaurant' },
  school:     { key: 'amenity', value: 'school' },
  bank:       { key: 'amenity', value: 'bank' },
  fuel:       { key: 'amenity', value: 'fuel' },
}

// ─── 3. Fetch nearby places ──────────────────────────────────────────────────
export const fetchNearbyPlaces = async (lat, lon, serviceType, radiusMeters = 5000) => {
  const tag = SERVICE_TAGS[serviceType]
  if (!tag) throw new Error('Unknown service type: ' + serviceType)

  const query = `
    [out:json][timeout:30];
    (
      node["${tag.key}"="${tag.value}"](around:${radiusMeters},${lat},${lon});
      way["${tag.key}"="${tag.value}"](around:${radiusMeters},${lat},${lon});
      relation["${tag.key}"="${tag.value}"](around:${radiusMeters},${lat},${lon});
    );
    out center 50;
  `

  console.log(`Fetching ${serviceType} near (${lat}, ${lon}) within ${radiusMeters}m`)

  try {
    const response = await axios.post(OVERPASS_URL, `data=${encodeURIComponent(query)}`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })

    console.log('Overpass response count:', response.data.elements?.length)

    if (!response.data.elements) return []

    return response.data.elements
      .filter(el => el.tags?.name) // only named places
      .map(el => ({
        id: el.id,
        name: el.tags?.name || 'Unnamed Place',
        type: serviceType,
        lat: el.lat ?? el.center?.lat,
        lon: el.lon ?? el.center?.lon,
        address: buildAddress(el.tags),
        phone: el.tags?.phone || el.tags?.['contact:phone'] || null,
        website: el.tags?.website || el.tags?.['contact:website'] || null,
        opening_hours: el.tags?.opening_hours || null,
        tags: el.tags
      }))
      .filter(el => el.lat && el.lon) // remove places with no coords

  } catch (err) {
    console.error('Overpass error:', err)
    throw new Error('Failed to fetch nearby places. Try again.')
  }
}

// ─── 4. Build readable address from tags ─────────────────────────────────────
const buildAddress = (tags) => {
  if (!tags) return 'Address not available'
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:suburb'],
    tags['addr:city'],
  ].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : (tags['addr:full'] || 'Address not available')
}

// ─── 5. Haversine distance (km) ──────────────────────────────────────────────
export const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}