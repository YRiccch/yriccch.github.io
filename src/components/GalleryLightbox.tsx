import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { GalleryItem } from '../data/galleryItems'
import { LocaleSwap } from './LocaleSwap'

type GalleryLightboxProps = {
  item: GalleryItem | null
  caption: string
  closeLabel: string
  onClose: () => void
}

/** Shared full-screen viewer for photos opened from either Life surface. */
export default function GalleryLightbox({
  item,
  caption,
  closeLabel,
  onClose,
}: GalleryLightboxProps) {
  useEffect(() => {
    if (!item) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [item, onClose])

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
        >
          <button
            onClick={(event) => {
              event.stopPropagation()
              onClose()
            }}
            aria-label={closeLabel}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-xl leading-none text-white transition-colors hover:border-white/60 hover:bg-white/15"
          >
            &times;
          </button>
          <motion.figure
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.92 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
            className="m-0 flex max-h-[86vh] max-w-[min(900px,92vw)] flex-col items-center gap-3"
          >
            <img
              src={item.url}
              alt={caption}
              className="h-auto max-h-[78vh] w-auto max-w-full rounded-lg shadow-2xl"
            />
            {caption && (
              <figcaption className="text-center text-sm text-white/85">
                <LocaleSwap>{caption}</LocaleSwap>
              </figcaption>
            )}
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
