'use client'

import { useRef, useState } from 'react'
import { X } from '@phosphor-icons/react'

const UploadTraySvg = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 5 L17 21" />
    <path d="M11 11 L17 5 L23 11" />
    <path d="M5 22 L5 28 L29 28 L29 22" />
  </svg>
)

const AddMoreSvg = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="7" y1="3" x2="7" y2="11" />
    <line x1="3" y1="7" x2="11" y2="7" />
  </svg>
)

interface Props {
  files: File[]
  onChange: (files: File[]) => void
  maxFiles?: number
  maxSizeMB?: number
}

export default function DropZone({ files, onChange, maxFiles = 5, maxSizeMB = 10 }: Props) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function addFiles(incoming: File[]) {
    const valid = incoming.filter(f =>
      ['image/jpeg', 'image/png'].includes(f.type) &&
      f.size <= maxSizeMB * 1024 * 1024
    )
    onChange([...files, ...valid].slice(0, maxFiles))
  }

  function removeFile(index: number) {
    onChange(files.filter((_, i) => i !== index))
  }

  const hasFiles = files.length > 0
  const canAddMore = files.length < maxFiles

  return (
    <div>
      {canAddMore && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault()
            setDragging(false)
            addFiles(Array.from(e.dataTransfer.files))
          }}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `1.5px dashed ${dragging ? 'var(--green)' : 'var(--border)'}`,
            borderRadius: 4,
            padding: hasFiles ? '14px 16px' : '32px 16px',
            textAlign: 'center',
            background: dragging ? 'rgba(74,124,89,0.04)' : '#fff',
            cursor: 'pointer',
            transition: 'border-color 0.15s, background 0.15s',
            marginBottom: hasFiles ? 12 : 0,
          }}
        >
          {hasFiles ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--green)' }}>
              <AddMoreSvg />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--green)' }}>
                Add More
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--gray)' }}>
                ({files.length}/{maxFiles})
              </span>
            </div>
          ) : (
            <>
              <div style={{ color: 'var(--gray)', marginBottom: 12, lineHeight: 0, display: 'inline-block' }}>
                <UploadTraySvg />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--black)', marginBottom: 6 }}>
                Drop photos here
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--gray)' }}>
                or{' '}
                <span style={{ color: 'var(--green)', textDecoration: 'underline' }}>browse files</span>
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--gray)', marginTop: 8, opacity: 0.7 }}>
                JPG or PNG · Up to {maxFiles} photos · {maxSizeMB}MB each
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        multiple
        style={{ display: 'none' }}
        onChange={e => {
          if (e.target.files) addFiles(Array.from(e.target.files))
          e.target.value = ''
        }}
      />

      {hasFiles && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {files.map((file, i) => (
            <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 3, overflow: 'hidden', background: 'var(--border)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={() => removeFile(i)}
                style={{
                  position: 'absolute', top: 4, right: 4,
                  background: 'rgba(15,15,13,0.7)',
                  border: 'none', borderRadius: '50%',
                  width: 20, height: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={10} color="#fff" weight="bold" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
