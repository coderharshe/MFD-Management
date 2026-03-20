'use client'

import { useState, useRef } from 'react'
import { uploadCasFile } from '../api/cas.actions'
import { useRouter } from 'next/navigation'

export function CasUploadCard() {
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'parsing' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFileName(file ? file.name : null)
    setError('')
    setMessage('')
    setUploadState('idle')
  }

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploadState('uploading')
    setMessage('')
    setError('')

    const formData = new FormData(e.currentTarget)
    const uploadResult = await uploadCasFile(formData)

    if (uploadResult?.error) {
      setError(uploadResult.error)
      setUploadState('error')
      return;
    } 
    
    if (uploadResult?.success && uploadResult.fileUrl && uploadResult.userId) {
      setUploadState('parsing')
      
      try {
        const parseRes = await fetch('/api/parse-cas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileUrl: uploadResult.fileUrl, userId: uploadResult.userId })
        })
        
        const parseResult = await parseRes.json()
        
        if (!parseRes.ok || parseResult.error) {
          setError(parseResult.error || 'Failed to extract financial data from the document.')
          setUploadState('error')
        } else {
          setMessage('Portfolio metadata parsed and configured successfully!')
          setUploadState('success')
          formRef.current?.reset()
          setFileName(null)
          
          router.refresh()
        }
      } catch (err) {
        setError('A network error occurred while parsing the document via AI.')
        setUploadState('error')
      }
    }
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Upload CAS PDF</h3>
        <p className="text-sm text-gray-500">
          Securely submit your Consolidated Account Statement. (PDF formats only, max 10MB)
        </p>
      </div>

      <form ref={formRef} onSubmit={handleUpload} className="flex flex-col gap-4 flex-grow justify-between">
        <div>
          <label 
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors group
              ${uploadState === 'uploading' || uploadState === 'parsing' ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-75' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-blue-300 cursor-pointer'}`}
          >
            <div className="rounded-full bg-blue-50 p-3 mb-3 text-blue-600 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            
            {fileName ? (
              <span className="text-sm font-semibold text-blue-600 text-center truncate w-full px-4">{fileName}</span>
            ) : (
              <span className="text-sm font-medium text-gray-700 text-center">Click to browse or drag file</span>
            )}
            
            <input 
              type="file" 
              name="file" 
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden" 
              required 
              disabled={uploadState === 'uploading' || uploadState === 'parsing'}
            />
          </label>

          {error && <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
          {message && <div className="mt-4 text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-100">{message}</div>}
        </div>

        <button 
          type="submit" 
          disabled={uploadState === 'uploading' || uploadState === 'parsing' || !fileName}
          className="w-full bg-gray-900 text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {uploadState === 'uploading' && (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading file...
            </span>
          )}
          {uploadState === 'parsing' && (
             <span className="flex items-center justify-center gap-2">
              <svg className="animate-bounce h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Parsing portfolio via AI...
            </span>
          )}
          {uploadState !== 'uploading' && uploadState !== 'parsing' && 'Upload Statement'}
        </button>
      </form>
    </div>
  )
}
