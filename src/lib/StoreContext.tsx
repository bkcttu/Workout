import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { loadStore, rollDaily, saveStore, todayISO, type Store } from './store'

type Ctx = {
  store: Store
  setStore: (updater: (s: Store) => Store) => void
}

const StoreCtx = createContext<Ctx | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStoreState] = useState<Store>(() => rollDaily(loadStore()))
  const storeRef = useRef(store)
  storeRef.current = store

  const setStore = useMemo(
    () => (updater: (s: Store) => Store) => {
      setStoreState((prev) => {
        const next = updater(prev)
        saveStore(next)
        return next
      })
    },
    [],
  )

  // Persist on first mount (covers the rollDaily migration result).
  useEffect(() => {
    saveStore(storeRef.current)
  }, [])

  // Roll over to a new day when the app is reopened or regains focus.
  useEffect(() => {
    const check = () => {
      const t = todayISO()
      if (
        storeRef.current.hydration.today.date !== t ||
        storeRef.current.nutrition.today.date !== t
      ) {
        setStore((s) => rollDaily(s))
      }
    }
    document.addEventListener('visibilitychange', check)
    window.addEventListener('focus', check)
    return () => {
      document.removeEventListener('visibilitychange', check)
      window.removeEventListener('focus', check)
    }
  }, [setStore])

  const value = useMemo(() => ({ store, setStore }), [store, setStore])
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore(): Ctx {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
