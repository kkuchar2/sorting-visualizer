'use client'

import React, { useEffect } from 'react'

import ReactDOM from 'react-dom'

interface ModalProps {
  onClose: () => void
  title?: string
  size?: 'default' | 'wide'
  children: React.ReactNode
}

const Modal = (props: ModalProps) => {
  const { onClose, title, size = 'default', children } = props

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleCloseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    onClose()
  }

  const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const onModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  const modalContent = (
    <div className={'modal-overlay'} onClick={onOverlayClick} role={'presentation'}>
      <div
        className={size === 'wide' ? 'modal-wrapper modal-wrapper--wide' : 'modal-wrapper'}
        onClick={onModalClick}
      >
        <div className={'modal'} role={'dialog'} aria-modal={'true'} aria-labelledby={title ? 'modal-title' : undefined}>
          <div className={'modal-header'}>
            {title && (
              <h2 id={'modal-title'} className={'modal-title'}>
                {title}
              </h2>
            )}
            <button type={'button'} className={'close-button'} aria-label={'Close'} onClick={handleCloseClick}>
              <div className={'line line-1'} />
              <div className={'line line-2'} />
            </button>
          </div>

          <div className={'modal-body'}>{children}</div>
        </div>
      </div>
    </div>
  )

  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) {
    return null
  }

  return ReactDOM.createPortal(modalContent, modalRoot)
}

export default Modal
