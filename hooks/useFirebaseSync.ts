import { useEffect, useRef } from 'react';
import { subscribeToCollection } from '../lib/firebaseService';
import { ref, set } from 'firebase/database';
import { database } from '../lib/firebaseConfig';

/**
 * Hook to sync ALL collections with Firebase Realtime Database
 * Provides real-time synchronization for all 27 entities
 * 
 * **SYNC STRATEGY**:
 * 1. On mount: Subscribe to Firebase for real-time updates
 * 2. If Firebase is empty BUT local data exists → Upload local to Firebase
 * 3. If Firebase has data → Update local state
 * 4. All local changes (add/update/delete) are synced via DataContext functions
 */

interface CollectionConfig<T> {
  collectionName: string;
  data: T[];
  setData: (data: T[]) => void;
}

interface UseFirebaseSyncProps {
  collections: CollectionConfig<any>[];
}

/**
 * Generic hook that syncs multiple collections with Firebase
 * Usage:
 * ```
 * useFirebaseSync({
 *   collections: [
 *     { collectionName: 'sites', data: sites, setData: setSites },
 *     { collectionName: 'employees', data: employees, setData: setEmployees },
 *     ...
 *   ]
 * });
 * ```
 */
export function useFirebaseSync({ collections }: UseFirebaseSyncProps) {
  const syncedRef = useRef(false);
  
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];
    
    // Subscribe to all collections
    collections.forEach(({ collectionName, data, setData }) => {
      console.log(`[Firebase] Setting up real-time subscription for ${collectionName}...`);
      
      const unsubscribe = subscribeToCollection<any>(collectionName, (firebaseData) => {
        console.log(`[Firebase] Received ${firebaseData.length} ${collectionName} from Firebase`);
        
        if (firebaseData.length > 0) {
          // Firebase has data → Update local state
          setData(firebaseData);
        } else if (data.length > 0 && !syncedRef.current) {
          // Firebase is empty BUT we have local data → Upload to Firebase
          console.log(`[Firebase] Uploading ${data.length} local ${collectionName} to Firebase...`);
          const collectionRef = ref(database, collectionName);
          const firebaseObject: Record<string, any> = {};
          data.forEach((item: any) => {
            const { id, ...rest } = item;
            firebaseObject[id] = { ...rest };
          });
          set(collectionRef, firebaseObject)
            .then(() => console.log(`[Firebase] ✅ Uploaded ${data.length} ${collectionName} to Firebase`))
            .catch((err) => console.error(`[Firebase] ❌ Failed to upload ${collectionName}:`, err));
        }
      });
      
      unsubscribers.push(unsubscribe);
    });
    
    // Mark as synced after first setup
    syncedRef.current = true;
    
    // Cleanup all subscriptions on unmount
    return () => {
      console.log(`[Firebase] Cleaning up ${collections.length} subscriptions`);
      unsubscribers.forEach(unsub => unsub());
    };
  }, []); // Empty dependency array - setup once on mount
  
  // Return status
  return {
    isConnected: true,
    isLoading: false,
    collectionsCount: collections.length
  };
}
