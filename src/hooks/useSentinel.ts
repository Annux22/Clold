import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Type definitions for the Sentinel's thought process
export interface SentinelState {
  status: 'IDLE' | 'SCANNING' | 'ANALYZING' | 'DISPATCHING';
  lastLog: string;
  goldPrice: number | null;
  marketSentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
}

/**
 * Custom Hook: useSentinel
 * Directly interfaces with the AI Edge Function to stream logic updates to the UI.
 */
export const useSentinel = () => {
  const [state, setState] = useState<SentinelState>({
    status: 'IDLE',
    lastLog: 'SYSTEM INITIALIZED. WAITING FOR INPUT...',
    goldPrice: null,
    marketSentiment: 'NEUTRAL'
  });

  // Polling mechanism to keep the dashboard "alive"
  useEffect(() => {
    const fetchAIUpdates = async () => {
      try {
        setState(prev => ({ ...prev, status: 'SCANNING' }));
        
        // Call the Edge Function (The Brain)
        const { data, error } = await supabase.functions.invoke('sentinel-core', {
          body: { query: 'STATUS_REPORT' }
        });

        if (error) throw error;

        // Update state with the AI's response
        setState({
          status: 'IDLE',
          lastLog: data.message, // e.g. "DETECTED VOLATILITY IN XAU. HOLDING POSITIONS."
          goldPrice: data.metrics.gold_price,
          marketSentiment: data.metrics.sentiment
        });

      } catch (err) {
        console.error("SENTINEL_CONNECTION_ERR", err);
        setState(prev => ({ 
          ...prev, 
          status: 'IDLE', 
          lastLog: 'CONNECTION LOST. RETRYING...' 
        }));
      }
    };

    // Execute scan every 10 seconds
    const interval = setInterval(fetchAIUpdates, 10000);
    return () => clearInterval(interval);
  }, []);

  return state;
};
