'use client'

import { useRef, useState } from 'react'
import { X, UploadSimple, Image } from '@phosphor-icons/react'

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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <UploadSimple size={16} color="var(--green)" />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--green)' }}>
                Add More
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--gray)' }}>
                ({files.length}/{maxFiles})
              </span>
            </div>
          ) : (
            <>
              <Image size={32} color="var(--gray)" weight="light" style={{ marginBottom: 12 }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--black)', marginBottom: 6 }}>
                Drop photos here
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--gray)' }}>
                or{' '}
                <span style={{ color: 'var(--green)', textDecoration: 'underline' }}>browse files</span>
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--border)', marginTop: 8 }}>
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
