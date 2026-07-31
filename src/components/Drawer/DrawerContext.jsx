
import { createContext, useContext, useMemo, useState } from 'react'


// Open: Boolean; toggle/open/close mutate

const DrawerContext = createContext(null);



export function DrawerProvider({children}){
    const [open, setOpen] = useState(false)

    const value = useMemo(() => ({
        open,
        openDrawer: () => setOpen(true), 
        closeDrawer: () => setOpen(false),
        toggle: () =>  setOpen(o => !o),
    }), [open])

    return <DrawerContext.Provider  value={value}>{children}</DrawerContext.Provider>

};

export const useDrawer = () => useContext (DrawerContext)