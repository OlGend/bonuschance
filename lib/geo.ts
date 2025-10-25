// lib/geo.ts

import { headers } from 'next/headers';

export async function getUserCountry(): Promise<string> {
  try {
    // Vercel автоматически добавляет geo headers
    const headersList = headers();
    const country = headersList.get('x-vercel-ip-country');
    
    if (country) {
      console.log('🌍 From Vercel header:', country);
      return country;
    }
    
    // Fallback
    console.log('⚠️ No geo header, using CA');
    return 'CA';
    
  } catch (error) {
    console.log('⚠️ Error, using CA');
    return 'CA';
  }
}