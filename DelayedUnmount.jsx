import { useEffect, useRef } from 'react'

const updateIds = children => {
  Array.from(children).reduce((accumulator, child) => {
    if (child.dataset.unmounted === undefined) {
      child.dataset.id = String(accumulator)
      delete child.clone
      delete child.prev
      return accumulator + 1
    }
    return accumulator
  }, 0)
}

const observerOptions = {
  childList: true,
  subtree: false
}

const areStatesDifferent = (state, newState) => {
  if (state.length !== newState.length) return true

  for (let i = 0; i < Math.max(state.length, newState.length); i++)
    if (state[i]?.dataset.id !== newState[i]?.dataset.id) return true

  return false
}

export const DelayedUnmount = ({
  component: Component = 'div',
  componentProps = {},
  timeout = 500,
  children,
  ...props
}) => {
  const containerRef = useRef(null)
  const stateRef = useRef(null)

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const container = containerRef.current
      const state = stateRef.current
      const newState = Array.from(container.children).filter(
        child => child.dataset.unmounted === undefined
      )

      if (areStatesDifferent(state, newState)) {
        observer.disconnect()

        let stable = []
        const toUnmount = []

        for (let i = 0; i < newState.length; i++) {
          let nowChild = newState[i]
          if (nowChild.dataset.id === undefined) continue
          const possibleStable = [nowChild]

          for (let j = i; j < newState.length; j++) {
            const child = newState[j]

            if (Number(child.dataset.id) > Number(nowChild.dataset.id)) {
              nowChild = child
              possibleStable.push(child)
            }
          }

          if (possibleStable.length > stable.length) stable = possibleStable
          if (stable.length >= newState.length - i) break
        }

        let unmountedIndex = 0

        for (const child of state) {
          if (stable[unmountedIndex]?.dataset.id === child.dataset.id)
            unmountedIndex++
          else {
            child.clone = child.cloneNode(true)
            child.prev = state[Number(child.dataset.id) - 1]
            child.clone.dataset.id = child.dataset.id + '_old'
            toUnmount.push(child)
          }
        }

        for (const child of toUnmount) {
          if (child.prev) {
            if (child.prev.clone?.isConnected)
              child.prev.clone.after(child.clone)
            else child.prev.after(child.clone)
          } else container.prepend(child.clone)

          child.clone.dataset.unmounted = 'true'
          delete child.clone.dataset.mounted
          setTimeout(child.clone.remove.bind(child.clone), timeout)
        }

        let mountedIndex = 0

        for (const child of newState) {
          delete child.dataset.mounted

          if (
            child.dataset.id !== undefined &&
            stable[mountedIndex]?.dataset.id === child.dataset.id
          )
            mountedIndex++
          else requestAnimationFrame(() => (child.dataset.mounted = 'true'))
        }

        stateRef.current = newState
        updateIds(container.children)
        observer.observe(container, observerOptions)
      }
    })

    updateIds(containerRef.current.children)
    stateRef.current = Array.from(containerRef.current.children)

    observer.observe(containerRef.current, observerOptions)

    return () => observer.disconnect()
  }, [timeout])

  return (
    <Component ref={containerRef} {...componentProps} {...props}>
      {children}
    </Component>
  )
}
