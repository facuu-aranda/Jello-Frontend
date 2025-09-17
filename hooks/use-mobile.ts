import * as React from "react"

// Usamos 1024px para que coincida con el breakpoint 'lg' de Tailwind
const MOBILE_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Esta función se ejecuta solo en el cliente, evitando errores de servidor
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Comprueba el tamaño al montar el componente
    checkDevice()

    window.addEventListener("resize", checkDevice)

    // Limpia el listener al desmontar el componente
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  return isMobile
}