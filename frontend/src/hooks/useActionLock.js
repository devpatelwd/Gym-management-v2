import { useEffect, useRef, useState } from "react"

export default function useActionLock() {
  const pendingRef = useRef({})
  const isMountedRef = useRef(true)
  const [pendingActions, setPendingActions] = useState({})

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  }, [])

  function setPending(actionName, value) {
    pendingRef.current[actionName] = value

    if (!isMountedRef.current) {
      return
    }

    setPendingActions((current) => ({
      ...current,
      [actionName]: value,
    }))
  }

  async function runLocked(actionName, action) {
    if (pendingRef.current[actionName]) {
      return
    }

    setPending(actionName, true)

    try {
      return await action()
    } finally {
      setPending(actionName, false)
    }
  }

  function isLocked(actionName) {
    return Boolean(pendingActions[actionName])
  }

  return { isLocked, runLocked }
}
