import { useEffect, useRef } from 'react'

export const DelayedUnmount = ({ timeout = 500, children }) => {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        for (const addedNode of mutation.addedNodes) {
          if (addedNode.nodeType === Node.ELEMENT_NODE) {
            const container = mutation.target

            Array.from(container.children).forEach((child, index) => {
              child.dataset.index = String(index)
            })

            addedNode.dataset.mounted = 'true'
          }
        }

        for (const removedNode of mutation.removedNodes) {
          if (removedNode.nodeType === Node.ELEMENT_NODE) {
            const container = mutation.target
            const index = removedNode.dataset.index

            if (removedNode.dataset.unmounted) {
              Array.from(container.children).forEach((child, index) => {
                child.dataset.index = String(index)
              })

              return
            }

            removedNode.dataset.unmounted = 'true'
            const nextNode = container.children[Number(index)]

            if (nextNode) nextNode.before(removedNode)
            else container.append(removedNode)

            setTimeout(() => {
              removedNode.remove()
            }, timeout)
          }
        }
      }
    })

    observer.observe(ref.current, {
      childList: true,
      subtree: false
    })

    Array.from(ref.current.children).forEach((child, index) => {
      child.dataset.index = String(index)
    })

    return () => observer.disconnect()
  }, [])

  return <div ref={ref}>{children}</div>
}
