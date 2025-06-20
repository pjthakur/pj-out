"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiUpload, FiFileText, FiStar, FiRefreshCw, FiWifi, FiWifiOff,
  FiMessageCircle, FiPlus, FiMinus, FiChevronLeft, FiChevronRight,
  FiEdit3, FiCheck, FiX, FiTarget, FiAward, FiTrendingUp,
  FiEye, FiBookOpen, FiSend, FiChevronUp
} from 'react-icons/fi'
import {
  HiOutlineLightBulb,
} from 'react-icons/hi'
import {
  MdScience
} from 'react-icons/md'
const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
const PDFJS_WORKER_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
declare global {
  interface Window {
    pdfjsLib: any;
  }
}
interface Comment {
  id: string
  x: number
  y: number
  page: number
  text: string
  timestamp: Date
}
interface ReviewData {
  clarity: number
  methodology: number
  significance: number
  originality: number
  overallRating: number
  strengths: string
  weaknesses: string
  recommendations: string
  confidenceLevel: number
}
interface OfflineData {
  reviews: ReviewData[]
  comments: Comment[]
  lastSync: Date | null
  pendingSubmissions?: ReviewData[]
}
type PDFDocument = any
function App() {
  const [showLandingPage, setShowLandingPage] = useState(true)
  const [pdfDocument, setPdfDocument] = useState<PDFDocument | null>(null)
  const [pdfKey, setPdfKey] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [scale, setScale] = useState(1.0)
  const [initialScale, setInitialScale] = useState(1.0)
  const [fitToWidth, setFitToWidth] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [selectedComment, setSelectedComment] = useState<string | null>(null)
  const [isAddingComment, setIsAddingComment] = useState(false)
  const [tempComment, setTempComment] = useState({ x: 0, y: 0, text: '' })
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [bottomPanelHeight, setBottomPanelHeight] = useState(300)
  const [isPanelDragging, setIsPanelDragging] = useState(false)
  const [panelStartY, setPanelStartY] = useState(0)
  const [panelStartHeight, setPanelStartHeight] = useState(0)
  const [pdfjsLib, setPdfjsLib] = useState<any>(null)
  const [reviewData, setReviewData] = useState<ReviewData>({
    clarity: 0,
    methodology: 0,
    significance: 0,
    originality: 0,
    overallRating: 0,
    strengths: '',
    weaknesses: '',
    recommendations: '',
    confidenceLevel: 50
  })
  const [isOnline, setIsOnline] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [offlineChanges, setOfflineChanges] = useState(0)
  const [showSyncNotification, setShowSyncNotification] = useState(false)
  const [showSubmissionNotification, setShowSubmissionNotification] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingSubmissions, setPendingSubmissions] = useState<ReviewData[]>([])
  const [isRendering, setIsRendering] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{
    strengths: string
    weaknesses: string
    recommendations: string
  }>({
    strengths: '',
    weaknesses: '',
    recommendations: ''
  })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const renderTaskRef = useRef<any>(null)
  const bottomPanelRef = useRef<HTMLDivElement>(null)
  const pdfContainerRef = useRef<HTMLDivElement>(null)
  const MIN_WORDS = {
    strengths: 5,
    weaknesses: 5,
    recommendations: 8
  }
  const MAX_WORDS = {
    strengths: 200,
    weaknesses: 200,
    recommendations: 200
  }
  const countWords = useCallback((text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }, [])
  const validateField = useCallback((field: keyof typeof MIN_WORDS, value: string): string => {
    const wordCount = countWords(value)
    const minWords = MIN_WORDS[field]
    const maxWords = MAX_WORDS[field]
    if (value.trim().length === 0) {
      return `This field is required`
    }
    if (wordCount < minWords) {
      return `Minimum ${minWords} words required`
    }
    if (wordCount > maxWords) {
      return `Maximum ${maxWords} words allowed`
    }
    return ''
  }, [countWords])
  const progress = useMemo(() => {
    const fields = [
      reviewData.clarity > 0,
      reviewData.methodology > 0,
      reviewData.significance > 0,
      reviewData.originality > 0,
      reviewData.overallRating > 0,
      reviewData.strengths.trim().length > 0 && !validationErrors.strengths,
      reviewData.weaknesses.trim().length > 0 && !validationErrors.weaknesses,
      reviewData.recommendations.trim().length > 0 && !validationErrors.recommendations
    ]
    return Math.round((fields.filter(Boolean).length / fields.length) * 100)
  }, [reviewData, validationErrors])
  useEffect(() => {
    const loadPDFJS = async () => {
      try {
        const globalWindow = window as any
        if (globalWindow.pdfjsLib) {
          setPdfjsLib(globalWindow.pdfjsLib)
          return
        }
        const script = document.createElement('script')
        script.src = PDFJS_CDN
        script.async = true
        await new Promise((resolve, reject) => {
          script.onload = () => {
            const globalWindow = window as any
            if (globalWindow.pdfjsLib) {
              globalWindow.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_CDN
              setPdfjsLib(globalWindow.pdfjsLib)
              console.log('PDF.js loaded successfully from CDN')
              resolve(true)
            } else {
              reject(new Error('PDF.js failed to load'))
            }
          }
          script.onerror = () => reject(new Error('Failed to load PDF.js script'))
          document.head.appendChild(script)
        })
      } catch (error) {
        console.error('Error loading PDF.js:', error)
        setPdfError('Failed to load PDF library. Please refresh the page.')
      }
    }
    loadPDFJS()
  }, [])
  useEffect(() => {
    const checkMobile = () => {
      const isMobileScreen = window.innerWidth <= 768
      setIsMobile(isMobileScreen)
      if (!pdfDocument) {
        setFitToWidth(isMobileScreen)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    window.addEventListener('orientationchange', checkMobile)
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('orientationchange', checkMobile)
    }
  }, [pdfDocument])
  useEffect(() => {
    const isModalOpen = (isAddingComment && tempComment.x > 0) || selectedComment
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isAddingComment, tempComment.x, selectedComment])
  useEffect(() => {
    return () => {
      if (isPanelDragging) {
        document.body.style.overflow = 'unset'
        document.body.style.position = 'static'
        document.body.style.width = 'auto'
      }
    }
  }, [isPanelDragging])
  const syncToServer = useCallback(async () => {
    if (!isOnline || isSyncing) return
    setIsSyncing(true)
    try {
      const dataToSync = localStorage.getItem('peerReviewData')
      const pendingSubmissionsData = localStorage.getItem('pendingSubmissions')
      if (!dataToSync && !pendingSubmissionsData) return
      await new Promise(resolve => setTimeout(resolve, 2000))
      if (pendingSubmissionsData) {
        localStorage.removeItem('pendingSubmissions')
        setPendingSubmissions([])
      }
      if (dataToSync) {
        localStorage.setItem('lastSyncTime', new Date().toISOString())
        localStorage.removeItem('offlineChanges')
        setOfflineChanges(0)
      }
      setShowSyncNotification(true)
      setTimeout(() => {
        setShowSyncNotification(false)
      }, 3000)
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setIsSyncing(false)
    }
  }, [isOnline, isSyncing])
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setTimeout(() => {
        const storedOfflineChanges = localStorage.getItem('offlineChanges')
        const storedPendingSubmissions = localStorage.getItem('pendingSubmissions')
        if ((storedOfflineChanges && parseInt(storedOfflineChanges, 10) > 0) ||
            (storedPendingSubmissions && JSON.parse(storedPendingSubmissions).length > 0)) {
          syncToServer()
        }
      }, 1000)
    }
    const handleOffline = () => {
      setIsOnline(false)
    }
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine)
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [syncToServer])
  useEffect(() => {
    if (!isOnline) {
      const totalChanges =
        (reviewData.clarity > 0 ? 1 : 0) +
        (reviewData.methodology > 0 ? 1 : 0) +
        (reviewData.significance > 0 ? 1 : 0) +
        (reviewData.originality > 0 ? 1 : 0) +
        (reviewData.overallRating > 0 ? 1 : 0) +
        (reviewData.strengths.trim().length > 0 ? 1 : 0) +
        (reviewData.weaknesses.trim().length > 0 ? 1 : 0) +
        (reviewData.recommendations.trim().length > 0 ? 1 : 0) +
        comments.length
      setOfflineChanges(totalChanges)
    }
  }, [reviewData, comments, isOnline])
  useEffect(() => {
    const storedOfflineChanges = localStorage.getItem('offlineChanges')
    if (storedOfflineChanges) {
      const changes = parseInt(storedOfflineChanges, 10)
      setOfflineChanges(changes)
    }
  }, [])
  useEffect(() => {
    const savedData = localStorage.getItem('peerReviewData')
    if (savedData) {
      try {
        const parsedData: OfflineData = JSON.parse(savedData)
        if (parsedData.reviews && parsedData.reviews.length > 0) {
          setReviewData(parsedData.reviews[parsedData.reviews.length - 1])
        }
        if (parsedData.comments) {
          setComments(parsedData.comments.map(c => ({
            ...c,
            timestamp: new Date(c.timestamp)
          })))
        }
      } catch (error) {
        console.error('Error loading offline data:', error)
      }
    }
    const pendingSubmissionsData = localStorage.getItem('pendingSubmissions')
    if (pendingSubmissionsData) {
      try {
        const submissions = JSON.parse(pendingSubmissionsData)
        setPendingSubmissions(submissions)
      } catch (error) {
        console.error('Error loading pending submissions:', error)
      }
    }
  }, [])
  useEffect(() => {
    const dataToSave: OfflineData = {
      reviews: [reviewData],
      comments,
      lastSync: new Date()
    }
    localStorage.setItem('peerReviewData', JSON.stringify(dataToSave))
    if (!isOnline) {
      localStorage.setItem('offlineChanges', offlineChanges.toString())
    }
  }, [reviewData, comments, isOnline, offlineChanges])
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchStartY, setTouchStartY] = useState(0)
  const [touchStartTime, setTouchStartTime] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [isPinching, setIsPinching] = useState(false)
  const [initialPinchDistance, setInitialPinchDistance] = useState(0)
  const [initialPinchScale, setInitialPinchScale] = useState(1)
  const [lastPinchUpdate, setLastPinchUpdate] = useState(0)
  const handlePanelTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsPanelDragging(true)
    setPanelStartY(e.touches[0].clientY)
    setPanelStartHeight(bottomPanelHeight)
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
  }, [bottomPanelHeight])
  const handlePanelTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPanelDragging) return
    e.preventDefault()
    e.stopPropagation()
    const currentY = e.touches[0].clientY
    const deltaY = panelStartY - currentY
    const newHeight = Math.max(80, Math.min(window.innerHeight * 0.8, panelStartHeight + deltaY))
    setBottomPanelHeight(newHeight)
  }, [isPanelDragging, panelStartY, panelStartHeight])
  const handlePanelTouchEnd = useCallback(() => {
    setIsPanelDragging(false)
    document.body.style.overflow = 'unset'
    document.body.style.position = 'static'
    document.body.style.width = 'auto'
    if (bottomPanelHeight < 150) {
      setBottomPanelHeight(80)
    } else if (bottomPanelHeight > window.innerHeight * 0.6) {
      setBottomPanelHeight(window.innerHeight * 0.8)
    } else {
      setBottomPanelHeight(300)
    }
  }, [bottomPanelHeight])
  const updateReviewData = useCallback((field: keyof ReviewData, value: ReviewData[keyof ReviewData]) => {
    setReviewData(prev => ({ ...prev, [field]: value }))
    if (field === 'strengths' || field === 'weaknesses' || field === 'recommendations') {
      const error = validateField(field, value as string)
      setValidationErrors(prev => ({ ...prev, [field]: error }))
    }
  }, [validateField])
  const resetAppState = useCallback(() => {
    setPdfDocument(null)
    setCurrentPage(1)
    setTotalPages(0)
    setScale(1.0)
    setInitialScale(1.0)
    setFitToWidth(isMobile)
    setPdfLoading(false)
    setPdfError(null)
    setReviewData({
      clarity: 0,
      methodology: 0,
      significance: 0,
      originality: 0,
      overallRating: 0,
      strengths: '',
      weaknesses: '',
      recommendations: '',
      confidenceLevel: 50
    })
    setValidationErrors({
      strengths: '',
      weaknesses: '',
      recommendations: ''
    })
    setComments([])
    setSelectedComment(null)
    setIsAddingComment(false)
    setTempComment({ x: 0, y: 0, text: '' })
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
    localStorage.removeItem('peerReviewData')
    localStorage.removeItem('offlineChanges')
    setOfflineChanges(0)
  }, [isMobile])
  const handleSubmitReview = useCallback(async () => {
    try {
      const hasValidationErrors = validationErrors.strengths || validationErrors.weaknesses || validationErrors.recommendations
      if (hasValidationErrors) {
        alert('Please fix validation errors before submitting.')
        return
      }
      setIsSubmitting(true)
      if (!isOnline) {
        const submissionData = {
          ...reviewData,
          submittedAt: new Date(),
          comments: comments
        }
        const existingSubmissions = localStorage.getItem('pendingSubmissions')
        const submissions = existingSubmissions ? JSON.parse(existingSubmissions) : []
        submissions.push(submissionData)
        localStorage.setItem('pendingSubmissions', JSON.stringify(submissions))
        setPendingSubmissions(submissions)
        setShowSubmissionNotification(true)
        setTimeout(() => {
          setShowSubmissionNotification(false)
          resetAppState()
          setIsSubmitting(false)
          if (isMobile) {
            setBottomPanelHeight(80)
          }
        }, 3000)
        return
      }
      await new Promise(resolve => setTimeout(resolve, 2000))
      setShowSubmissionNotification(true)
      setTimeout(() => {
        setShowSubmissionNotification(false)
        resetAppState()
        setIsSubmitting(false)
        if (isMobile) {
          setBottomPanelHeight(80)
        }
      }, 3000)
    } catch (error) {
      console.error('Submission failed:', error)
      setIsSubmitting(false)
      alert('Failed to submit review. Please try again.')
    }
  }, [resetAppState, reviewData, comments, isOnline, isMobile, setBottomPanelHeight, validationErrors])
  const calculateFitToWidthScale = useCallback(async (pdfDoc: any, pageNum: number = 1) => {
    if (!pdfDoc || !pdfContainerRef.current) return 1.0
    try {
      const page = await pdfDoc.getPage(pageNum)
      const viewport = page.getViewport({ scale: 1.0 })
      const containerWidth = pdfContainerRef.current.clientWidth
      const padding = isMobile ? 16 : 32
      const availableWidth = containerWidth - padding
      const fitScale = availableWidth / viewport.width
      return Math.min(Math.max(fitScale, 0.3), 1.5)
    } catch (error) {
      console.error('Error calculating fit-to-width scale:', error)
      return 1.0
    }
  }, [isMobile])
  useEffect(() => {
    const handleResize = async () => {
      if (isMobile && pdfDocument && fitToWidth) {
        setTimeout(async () => {
          const fitScale = await calculateFitToWidthScale(pdfDocument, currentPage)
          setInitialScale(fitScale)
          setScale(fitScale)
        }, 100)
      }
    }
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [isMobile, pdfDocument, fitToWidth, calculateFitToWidthScale, currentPage])
  const renderPage = useCallback(async (pageNum: number, pdfDoc?: any) => {
    const activePdfDocument = pdfDoc || pdfDocument
    if (!activePdfDocument || !canvasRef.current || !pdfjsLib) return
    try {
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel()
        } catch (e) {
        }
        renderTaskRef.current = null
      }
      const page = await activePdfDocument.getPage(pageNum)
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      if (!context) return
      const devicePixelRatio = window.devicePixelRatio || 1
      const effectiveScale = scale
      const viewport = page.getViewport({ scale: effectiveScale })
      const canvasWidth = Math.ceil(viewport.width * devicePixelRatio)
      const canvasHeight = Math.ceil(viewport.height * devicePixelRatio)
      if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
        canvas.width = canvasWidth
        canvas.height = canvasHeight
        canvas.style.width = Math.ceil(viewport.width) + 'px'
        canvas.style.height = Math.ceil(viewport.height) + 'px'
        canvas.style.maxWidth = 'none'
        canvas.style.minWidth = 'none'
        canvas.style.boxSizing = 'content-box'
      }
      if (devicePixelRatio !== 1) {
        context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
      } else {
        context.setTransform(1, 0, 0, 1, 0, 0)
      }
      context.clearRect(0, 0, viewport.width, viewport.height)
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      }
      renderTaskRef.current = page.render(renderContext)
      await renderTaskRef.current.promise
      renderTaskRef.current = null
    } catch (error) {
      if (error instanceof Error && error.name === 'RenderingCancelledException') {
        console.log('Rendering was cancelled for page', pageNum)
        return
      }
      console.error('Error rendering page:', pageNum, error)
      setPdfError(`Failed to render page ${pageNum}`)
    }
  }, [pdfDocument, scale, pdfjsLib])
  const loadPDF = useCallback(async (file: File | string, retryCount = 0) => {
    if (!pdfjsLib) {
      setPdfError('PDF library not loaded. Please refresh the page.')
      return
    }
    setPdfLoading(true)
    setPdfError(null)
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
    try {
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel()
        } catch (e) {
        }
        renderTaskRef.current = null
      }
      let loadingTask
      if (typeof file === 'string') {
        loadingTask = pdfjsLib.getDocument({
          url: file,
          cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
          cMapPacked: true,
          httpHeaders: {},
          withCredentials: false
        })
      } else {
        const arrayBuffer = await file.arrayBuffer()
        loadingTask = pdfjsLib.getDocument({
          data: arrayBuffer,
          cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
          cMapPacked: true,
        })
      }
      const pdf = await loadingTask.promise
      setPdfDocument(pdf)
      setTotalPages(pdf.numPages)
      setCurrentPage(1)
      setPdfKey(Date.now().toString())
      setComments([])
      console.log(`PDF loaded successfully: ${pdf.numPages} pages`)
      if (isMobile) {
        const fitScale = await calculateFitToWidthScale(pdf, 1)
        setInitialScale(fitScale)
        if (fitToWidth) {
          setScale(fitScale)
        }
      }
      if (pdf.numPages > 0) {
        const renderTimeout = setTimeout(() => {
          if (canvasRef.current && pdfjsLib && !renderTaskRef.current) {
            renderPage(1, pdf)
          }
        }, 100)
      }
    } catch (error) {
      console.error('Error loading PDF (attempt ' + (retryCount + 1) + '):', error)
      if (retryCount < 2) {
        console.log('Retrying PDF load...')
        setTimeout(() => {
          loadPDF(file, retryCount + 1)
        }, 1000)
        return
      }
      setPdfError('Failed to load PDF. Please try uploading the file again.')
    } finally {
    if (retryCount === 0) {
        setPdfLoading(false)
      }
    }
  }, [renderPage, pdfjsLib])
  useEffect(() => {
    console.log('PDF useEffect triggered', { pdfDocument: !!pdfDocument, currentPage, pdfKey })
    const renderTimeout = setTimeout(() => {
      if (pdfDocument && currentPage && pdfjsLib && canvasRef.current) {
        console.log('Calling renderPage from useEffect')
        renderPage(currentPage)
      } else if (!pdfDocument && canvasRef.current) {
        console.log('Clearing canvas - no PDF document')
        const ctx = canvasRef.current.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        }
      }
    }, 50)
    return () => {
      clearTimeout(renderTimeout)
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel()
        } catch (e) {
        }
        renderTaskRef.current = null
      }
    }
  }, [pdfDocument, currentPage, scale, pdfjsLib, pdfKey])
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    setPdfError(null)
    setPdfDocument(null)
    setCurrentPage(1)
    setTotalPages(0)
    setReviewData({
      clarity: 0,
      methodology: 0,
      significance: 0,
      originality: 0,
      overallRating: 0,
      strengths: '',
      weaknesses: '',
      recommendations: '',
      confidenceLevel: 50
    })
    setComments([])
    setSelectedComment(null)
    setIsAddingComment(false)
    setTempComment({ x: 0, y: 0, text: '' })
    localStorage.removeItem('peerReviewData')
    localStorage.removeItem('offlineChanges')
    setOfflineChanges(0)
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        canvas.style.display = 'none'
        canvas.offsetHeight
        canvas.style.display = 'block'
      }
    }
    if (file.type !== 'application/pdf') {
      setPdfError('Please select a valid PDF file')
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      setPdfError('File is too large. Please select a PDF under 50MB.')
      return
    }
    console.log('Loading PDF file:', file.name, 'Size:', (file.size / (1024 * 1024)).toFixed(1) + 'MB')
    setShowLandingPage(false)
    loadPDF(file)
    event.target.value = ''
  }, [loadPDF])
  const goToPage = useCallback((pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum)
    }
  }, [totalPages])
  const getTouchDistance = useCallback((touch1: React.Touch, touch2: React.Touch) => {
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    )
  }, [])
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault()
      setIsPinching(true)
      setIsSwiping(false)
      const distance = getTouchDistance(e.touches[0], e.touches[1])
      setInitialPinchDistance(distance)
      setInitialPinchScale(scale)
      if (fitToWidth) {
        setFitToWidth(false)
      }
    } else if (e.touches.length === 1 && isMobile) {
      setIsPinching(false)
      const touch = e.touches[0]
      setTouchStartX(touch.clientX)
      setTouchStartY(touch.clientY)
      setTouchStartTime(Date.now())
      setIsSwiping(false)
    }
  }, [isMobile, getTouchDistance, scale, fitToWidth])
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && isPinching) {
      e.preventDefault()
      const now = Date.now()
      if (now - lastPinchUpdate < 16) return
      const currentDistance = getTouchDistance(e.touches[0], e.touches[1])
      if (initialPinchDistance > 0 && currentDistance > 30) {
        const scaleRatio = currentDistance / initialPinchDistance
        const newScale = initialPinchScale * scaleRatio
        const boundedScale = Math.min(Math.max(newScale, 0.5), 1.5)
        const currentScale = scale
        if (Math.abs(boundedScale - currentScale) > 0.01) {
          setScale(boundedScale)
          setLastPinchUpdate(now)
        }
      }
    } else if (e.touches.length === 1 && isMobile && touchStartX > 0 && !isPinching) {
      const touch = e.touches[0]
      const deltaX = Math.abs(touch.clientX - touchStartX)
      const deltaY = Math.abs(touch.clientY - touchStartY)
      if (deltaX > deltaY && deltaX > 20) {
        setIsSwiping(true)
        e.preventDefault()
      }
    }
  }, [touchStartX, touchStartY, isMobile, isPinching, getTouchDistance, initialPinchDistance, initialPinchScale, lastPinchUpdate, scale])
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (isPinching && e.touches.length < 2) {
      setIsPinching(false)
      setInitialPinchDistance(0)
      setInitialPinchScale(1)
      setLastPinchUpdate(0)
    }
    if (e.changedTouches.length === 1 && isMobile && touchStartX > 0 && !isPinching) {
      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStartX
      const deltaY = Math.abs(touch.clientY - touchStartY)
      const deltaTime = Date.now() - touchStartTime
      const distance = Math.abs(deltaX)
      const velocity = distance / deltaTime
      const minDistance = 50
      const maxTime = 500
      const minVelocity = 0.1
      if (
        isSwiping &&
        distance > minDistance &&
        deltaTime < maxTime &&
        velocity > minVelocity &&
        deltaY < distance * 0.3
      ) {
        if (deltaX > 0) {
          if (currentPage > 1) {
            goToPage(currentPage - 1)
          }
        } else {
          if (currentPage < totalPages) {
            goToPage(currentPage + 1)
          }
        }
      }
    }
    if (e.touches.length === 0) {
      setTouchStartX(0)
      setTouchStartY(0)
      setTouchStartTime(0)
      setIsSwiping(false)
    }
  }, [touchStartX, touchStartY, touchStartTime, isSwiping, isMobile, currentPage, totalPages, goToPage, isPinching])
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    if (target.closest('.comment-overlay') || target.closest('.comment-marker')) {
      return
    }
    if (selectedComment) {
      setSelectedComment(null)
      return
    }
    if (!isAddingComment || !overlayRef.current) return
    const rect = overlayRef.current.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setTempComment({ x, y, text: '' })
  }, [isAddingComment, selectedComment])
  const addComment = useCallback((text: string) => {
    if (text.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        x: tempComment.x,
        y: tempComment.y,
        page: currentPage,
        text: text.trim(),
        timestamp: new Date()
      }
      setComments(prev => [...prev, newComment])
      setTempComment({ x: 0, y: 0, text: '' })
      setIsAddingComment(false)
    }
  }, [tempComment, currentPage])
  const deleteComment = useCallback((commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId))
    setSelectedComment(null)
  }, [])
  const currentPageComments = useMemo(() => {
    return comments.filter(c => c.page === currentPage)
  }, [comments, currentPage])
  const getCommentBoxClasses = useCallback((x: number, y: number) => {
    if (isMobile) {
      return {
        containerClass: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        arrowClass: 'absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white'
      }
    }
    const isNearTop = y < 25
    const isNearLeft = x < 25
    const isNearRight = x > 75
    if (isNearTop) {
      return {
        containerClass: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        arrowClass: 'absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white'
      }
    } else if (isNearLeft) {
      return {
        containerClass: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
        arrowClass: 'absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-white'
      }
    } else if (isNearRight) {
      return {
        containerClass: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        arrowClass: 'absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-white'
      }
    } else {
      return {
        containerClass: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        arrowClass: 'absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white'
      }
    }
  }, [isMobile])
  const getCommentBoxPosition = useCallback((x: number, y: number, isTemp: boolean = false) => {
    if (!overlayRef.current) return { x, y, position: 'bottom' }
    const overlay = overlayRef.current
    const overlayRect = overlay.getBoundingClientRect()
    const boxWidth = isMobile ? 192 : 256
    const boxHeight = isTemp ? 160 : 120
    const margin = 8
    const absoluteX = (x / 100) * overlayRect.width
    const absoluteY = (y / 100) * overlayRect.height
    let position = 'bottom'
    let adjustedX = x
    let adjustedY = y
    if (absoluteX + boxWidth / 2 > overlayRect.width - margin) {
      adjustedX = ((overlayRect.width - margin - boxWidth / 2) / overlayRect.width) * 100
    }
    if (absoluteX - boxWidth / 2 < margin) {
      adjustedX = ((margin + boxWidth / 2) / overlayRect.width) * 100
    }
    if (absoluteY + boxHeight + margin > overlayRect.height) {
      position = 'top'
    }
    if (absoluteY - boxHeight - margin < 0 && position === 'top') {
      position = 'bottom'
      if (absoluteY + boxHeight + margin > overlayRect.height) {
        position = absoluteX > overlayRect.width / 2 ? 'left' : 'right'
      }
    }
    return { x: adjustedX, y: adjustedY, position }
  }, [isMobile])
  const StarRating = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={(e) => {
            e.preventDefault()
            onChange(star)
          }}
          className={`transition-colors cursor-pointer ${
            star <= value
              ? 'text-yellow-400 hover:text-yellow-500'
              : 'text-gray-300 hover:text-gray-400'
          }`}
        >
          <FiStar
            className="w-6 h-6 md:w-7 md:h-7"
            fill={star <= value ? 'currentColor' : 'none'}
            strokeWidth={2}
          />
        </button>
      ))}
    </div>
  )
  const LandingPage = () => (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {}
      <motion.header
        className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiFileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PDF Peer Review</h1>
                <p className="text-sm text-gray-600">Academic Review Platform</p>
              </div>
            </motion.div>
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {isOnline ? <FiWifi className="w-4 h-4 mr-1" /> : <FiWifiOff className="w-4 h-4 mr-1" />}
                {isOnline ? 'Online' : 'Offline'}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>
      {}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Streamline Your
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Peer Review</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              A modern, intuitive platform for conducting comprehensive academic peer reviews.
              Upload PDF documents, add annotations, and provide detailed feedback with our advanced review tools.
            </p>
          </motion.div>
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-3 mx-auto cursor-pointer"
            >
              <FiUpload className="w-6 h-6" />
              <span>Upload PDF to Start Review</span>
            </button>
            <p className="text-sm text-gray-500 mt-3">Support for PDF files up to 50MB</p>
          </motion.div>
          {}
          <motion.div
            className="grid md:grid-cols-3 gap-8 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="bg-white p-8 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <FiMessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Interactive Annotations</h3>
              <p className="text-gray-600">Add contextual comments directly on PDF pages with precise positioning and easy management.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-indigo-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <FiStar className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Comprehensive Ratings</h3>
              <p className="text-gray-600">Evaluate research across multiple criteria with detailed scoring and confidence levels.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-purple-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <FiWifiOff className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Offline Support</h3>
              <p className="text-gray-600">Continue your review work offline with automatic sync when connection is restored.</p>
            </div>
          </motion.div>
        </div>
      </main>
      {}
      <motion.footer
        className="bg-white border-t border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <FiFileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-900 font-semibold">PDF Peer Review</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <FiTarget className="w-4 h-4" />
                <span>Academic Excellence</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiAward className="w-4 h-4" />
                <span>Quality Reviews</span>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  )
  if (showLandingPage) {
    return (
      <>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
            body {
              font-family: 'Poppins', sans-serif;
              margin: 0;
              padding: 0;
              background: #f8fafc;
              color: #1e293b;
              min-height: 100vh;
            }
          `}
        </style>
        <AnimatePresence>
          <LandingPage />
        </AnimatePresence>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
      </>
    )
  }
  if (!pdfjsLib) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-transparent border-t-4 border-t-blue-600 mx-auto mb-4"></div>
          <div className="bg-gray-200 h-2 w-48 mx-auto mb-4 rounded-full overflow-hidden loading-shimmer"></div>
          <p className="text-gray-700 font-semibold text-lg">Loading PDF Library...</p>
          <p className="text-sm text-gray-500">Please wait a moment</p>
        </div>
      </motion.div>
    )
  }
  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
          body {
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            margin: 0;
            padding: 0;
            background: #f8fafc;
            color: #1e293b;
            min-height: 100vh;
            font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
            letter-spacing: -0.025em;
          }
          ::-webkit-scrollbar {
            width: 0px;
            height: 0px;
            background: transparent;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: transparent;
          }
          ::-webkit-scrollbar-corner {
            background: transparent;
          }
          * {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .custom-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 0px;
            height: 0px;
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: transparent;
          }
          .mobile-panel-scroll {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .mobile-panel-scroll::-webkit-scrollbar {
            width: 0px;
            height: 0px;
            background: transparent;
          }
          .mobile-panel-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .mobile-panel-scroll::-webkit-scrollbar-thumb {
            background: transparent;
          }
          .mobile-panel-scroll::-webkit-scrollbar-thumb:hover {
            background: transparent;
          }
          .professional-header {
            background: linear-gradient(135deg, #1e293b, #0f172a);
            border-bottom: 1px solid #334155;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
          }
          .btn-primary {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            border: 1px solid #3b82f6;
            color: white;
            font-weight: 600;
            box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
          }
          .btn-primary:hover {
            background: linear-gradient(135deg, #1d4ed8, #1e40af);
            border-color: #1d4ed8;
            box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
            transform: translateY(-1px);
          }
          .btn-secondary {
            background: #64748b;
            border: 1px solid #64748b;
            color: white;
            font-weight: 600;
            box-shadow: 0 2px 4px rgba(100, 116, 139, 0.2);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
          }
          .btn-secondary:hover {
            background: #475569;
            border-color: #475569;
            box-shadow: 0 4px 8px rgba(100, 116, 139, 0.3);
            transform: translateY(-1px);
          }
          .btn-success {
            background: linear-gradient(135deg, #10b981, #059669);
            border: 1px solid #10b981;
            color: white;
            font-weight: 600;
            box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
          }
          .btn-success:hover {
            background: linear-gradient(135deg, #059669, #047857);
            border-color: #059669;
            box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
            transform: translateY(-1px);
          }
          .card-professional {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            border: 1px solid #e2e8f0;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .card-professional:hover {
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            transform: translateY(-2px);
          }
          .status-online {
            background: linear-gradient(135deg, #10b981, #059669);
            box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
          }
          .status-offline {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
          }
          .status-syncing {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            box-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);
          }
          .progress-bar {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
          }
          .loading-shimmer {
            background: linear-gradient(90deg, #f1f5f9, #e2e8f0, #f1f5f9);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .professional-slider {
            -webkit-appearance: none;
            appearance: none;
            height: 6px;
            background: #e2e8f0;
            border-radius: 3px;
            outline: none;
            position: relative;
          }
          .professional-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: #ffffff;
            border: 2px solid #3b82f6;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .professional-slider::-webkit-slider-thumb:hover {
            border-color: #1d4ed8;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            transform: scale(1.05);
          }
          .professional-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #ffffff;
            border: 2px solid #3b82f6;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .professional-slider::-moz-range-track {
            height: 6px;
            background: #e2e8f0;
            border-radius: 3px;
            border: none;
          }
          .text-primary {
            color: #3b82f6;
          }
          .text-secondary {
            color: #64748b;
          }
          .text-accent {
            color: #1d4ed8;
          }
          .bg-primary {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          }
          .bg-surface {
            background: #ffffff;
          }
          .border-primary {
            border-color: #3b82f6;
          }
          .modern-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
          }
          .modern-card:hover {
            border-color: #cbd5e1;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
          }
          .subtle-bg {
            background: #f8fafc;
          }
          .panel-section {
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 1rem;
            margin-bottom: 1.5rem;
          }
          .section-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
            color: #334155;
            margin-bottom: 1rem;
          }
          .icon-badge {
            width: 20px;
            height: 20px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
          }
          .comment-box-top {
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 8px;
          }
          .comment-box-bottom {
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 8px;
          }
          .comment-box-left {
            top: 50%;
            right: 100%;
            transform: translateY(-50%);
            margin-right: 8px;
          }
          .comment-box-right {
            top: 50%;
            left: 100%;
            transform: translateY(-50%);
            margin-left: 8px;
          }
          .comment-arrow-top {
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid white;
          }
          .comment-arrow-bottom {
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 6px solid white;
          }
          .comment-arrow-left {
            top: 50%;
            left: 100%;
            transform: translateY(-50%);
            border-top: 6px solid transparent;
            border-bottom: 6px solid transparent;
            border-left: 6px solid white;
          }
          .comment-arrow-right {
            top: 50%;
            right: 100%;
            transform: translateY(-50%);
            border-top: 6px solid transparent;
            border-bottom: 6px solid transparent;
            border-right: 6px solid white;
          }
          .icon-badge-blue { background: #3b82f6; color: white; }
          .icon-badge-green { background: #10b981; color: white; }
          .icon-badge-purple { background: #8b5cf6; color: white; }
          .icon-badge-amber { background: #f59e0b; color: white; }
          .icon-badge-orange { background: #6366f1; color: white; }
          .icon-badge-yellow { background: #eab308; color: white; }
          .icon-badge-indigo { background: #6366f1; color: white; }
          .header-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            position: relative;
            z-index: 50;
            min-height: 64px;
            padding: 0.75rem 1rem;
          }
          .header-left {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-shrink: 0;
            min-width: 0;
          }
          .header-center {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1;
            padding: 0 1rem;
          }
          .header-right {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
            min-width: 0;
            justify-content: flex-end;
          }
          .logo-container {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
          }
          .status-badge {
            flex-shrink: 0;
            white-space: nowrap;
          }
          @media (max-width: 768px) {
            .header-container {
              padding: 0.5rem 1rem;
            }
            .header-left {
              gap: 8px;
            }
            .header-right {
              gap: 6px;
            }
            .header-center {
              padding: 0 0.5rem;
            }
          }
                      @media (max-width: 640px) {
              .header-container {
                gap: 8px;
              }
              .header-center {
                padding: 0 0.25rem;
              }
            }
        `}
      </style>
      <motion.div
        className="min-h-screen relative bg-slate-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
      <motion.div
        className="header-container"
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          borderBottom: '1px solid #334155',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
        }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="header-left">
          <motion.div
            className="logo-container cursor-pointer"
            onClick={() => setShowLandingPage(true)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiFileText className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full border border-slate-700 flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-white">PDF Peer Review</h1>
              <p className="text-xs text-slate-300">Academic Platform</p>
            </div>
          </motion.div>
        </div>
        <div className="header-right">
          <motion.div
            className="flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium text-white shadow-md"
            animate={{ scale: isOnline ? 1 : 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ opacity: isOnline ? [1, 0.7, 1] : 1 }}
              transition={{ duration: 2, repeat: isOnline ? Infinity : 0 }}
            >
              {isOnline ? <FiWifi className="w-5 h-5 text-blue-400" /> : <FiWifiOff className="w-5 h-5 text-red-500" />}
            </motion.div>
            <span className="hidden sm:inline ml-1.5 text-xs">{isOnline ? 'Online' : 'Offline'}</span>
          </motion.div>
          <AnimatePresence>
            {(offlineChanges > 0 || pendingSubmissions.length > 0 || isSyncing || !isOnline) && (
              <motion.button
                onClick={syncToServer}
                disabled={!isOnline || isSyncing}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-md cursor-pointer ${
                  isSyncing
                    ? 'bg-amber-500 text-white cursor-not-allowed'
                    : !isOnline
                    ? 'bg-slate-500 text-white cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: (isSyncing || !isOnline) ? 1 : 1.05 }}
                whileTap={{ scale: (isSyncing || !isOnline) ? 1 : 0.95 }}
              >
                {isSyncing ? (
                  <>
                    <motion.div
                      className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="hidden sm:inline">Syncing...</span>
                  </>
                ) : !isOnline ? (
                  <>
                    <FiRefreshCw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sync</span>
                    <span className="bg-white/25 px-1.5 py-0.5 rounded text-xs font-bold">
                      {offlineChanges + pendingSubmissions.length}
                    </span>
                  </>
                ) : (
                  <>
                    <FiRefreshCw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sync</span>
                    <span className="bg-white/25 px-1.5 py-0.5 rounded text-xs font-bold">
                      {offlineChanges + pendingSubmissions.length}
                    </span>
                  </>
                )}
              </motion.button>
            )}
          </AnimatePresence>
          <motion.button
            onClick={() => fileInputRef.current?.click()}
            className="backdrop-blur-md text-white hover:bg-white/25 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold cursor-pointer border border-white/25 hover:border-white/40 transition-all shadow-md hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center sm:space-x-1.5">
              <FiUpload className="w-5 h-5" />
              <span className="hidden md:inline">Upload PDF</span>
            </div>
          </motion.button>
          {!isMobile && (
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/25 shadow-md">
                <div className="flex items-center space-x-2">
                  <FiTrendingUp className="w-3.5 h-3.5 text-blue-300" />
                  <span className="text-xs font-semibold text-white">Progress:</span>
                  <span className="text-sm font-bold text-blue-300">{progress}%</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
      <AnimatePresence>
        {showSyncNotification && (
          <motion.div
            className={`fixed z-[9999] bg-blue-500 text-white px-4 md:px-6 py-3 md:py-4 rounded-xl shadow-2xl flex items-center space-x-3 border border-blue-400 ${
              isMobile
                ? 'bottom-6 left-4 right-4'
                : 'bottom-6 right-6 max-w-sm'
            }`}
            initial={{
              opacity: 0,
              y: isMobile ? 50 : 50,
              x: isMobile ? 0 : 50,
              scale: 0.8
            }}
            animate={{
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1
            }}
            exit={{
              opacity: 0,
              y: isMobile ? 50 : 50,
              x: isMobile ? 0 : 50,
              scale: 0.8
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.div
              className="text-white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <FiCheck className="w-5 h-5" />
            </motion.div>
            <div>
              <div className="font-bold text-sm md:text-base">Sync Successful!</div>
              <div className="text-xs md:text-sm opacity-90">
                {pendingSubmissions.length > 0 ? 'Reviews and data synced to cloud' : 'Data saved to cloud'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSubmissionNotification && (
          <motion.div
            className={`fixed z-[9999] bg-blue-500 text-white px-4 md:px-6 py-4 md:py-5 rounded-xl shadow-2xl border border-blue-400 ${
              isMobile
                ? 'bottom-6 left-4 right-4'
                : 'bottom-6 right-6 max-w-sm'
            }`}
            initial={{
              opacity: 0,
              y: isMobile ? 50 : 50,
              x: isMobile ? 0 : 50,
              scale: 0.8
            }}
            animate={{
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1
            }}
            exit={{
              opacity: 0,
              y: isMobile ? 50 : 50,
              x: isMobile ? 0 : 50,
              scale: 0.8
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
                        <div className="flex items-center space-x-3">
              <motion.div
                className="text-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <FiCheck className="w-6 h-6" />
              </motion.div>
              <div className="flex-1">
                <div className="font-bold text-base md:text-lg">Review Submitted Successfully!</div>
                <div className="text-xs md:text-sm opacity-90 mt-1">
                  {!isOnline ? 'Saved offline - will sync when online' : 'Resetting for next review...'}
                </div>
              </div>
            </div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100 to-transparent opacity-30 rounded-xl"
              animate={{ x: [-100, 300] }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className={isMobile ? "h-[calc(100vh-76px)] relative" : "flex h-[calc(100vh-76px)]"}>
        <div className={`flex flex-col bg-white ${isMobile ? 'h-full' : 'flex-1 border-r border-gray-200'}`}>
          <div className="border-b border-gray-200 p-1 md:p-2 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {isMobile && (
                <motion.button
                  onClick={async () => {
                    if (!pdfDocument) return
                    const newFitToWidth = !fitToWidth
                    setFitToWidth(newFitToWidth)
                    if (newFitToWidth) {
                      const fitScale = await calculateFitToWidthScale(pdfDocument, currentPage)
                      setInitialScale(fitScale)
                      setScale(fitScale)
                    }
                  }}
                  disabled={!pdfDocument}
                  className={`p-1 text-xs rounded cursor-pointer ${
                    !pdfDocument
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : fitToWidth
                      ? 'bg-gray-500 text-white cursor-pointer'
                      : 'bg-blue-500 text-white cursor-pointer'
                  }`}
                  whileHover={pdfDocument ? { scale: 1.05 } : {}}
                  whileTap={pdfDocument ? { scale: 0.95 } : {}}
                >
                  <FiTarget className="w-5 h-5" />
                </motion.button>
              )}
              <motion.button
                onClick={() => {
                  if (!pdfDocument) return
                  if (isMobile && fitToWidth) {
                    setFitToWidth(false)
                  }
                  setScale(s => Math.max(0.5, s - (isMobile ? 0.2 : 0.1)))
                }}
                disabled={!pdfDocument || scale <= 0.5}
                className={`p-1 text-xs rounded cursor-pointer ${
                  (!pdfDocument || scale <= 0.5)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-500 text-white cursor-pointer hover:bg-gray-600'
                }`}
                whileHover={(pdfDocument && scale > 0.5) ? { scale: 1.05 } : {}}
                whileTap={(pdfDocument && scale > 0.5) ? { scale: 0.95 } : {}}
              >
                <FiMinus className="w-5 h-5" />
              </motion.button>
              <motion.span
                className={`text-xs px-2 py-1 rounded bg-gray-100 font-medium min-w-[50px] text-center ${
                  pdfDocument ? 'text-gray-700' : 'text-gray-400'
                }`}
                key={Math.round(scale * 100)}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {Math.round(scale * 100)}%
                {isMobile && fitToWidth && (
                  <span className="text-xs text-blue-600 ml-1">FIT</span>
                )}
                {scale >= 1.5 && (
                  <span className="text-xs text-indigo-600 ml-1">MAX</span>
                )}
              </motion.span>
              <motion.button
                onClick={() => {
                  if (!pdfDocument) return
                  if (isMobile && fitToWidth) {
                    setFitToWidth(false)
                  }
                  setScale(s => Math.min(1.5, s + (isMobile ? 0.2 : 0.1)))
                }}
                disabled={!pdfDocument || scale >= 1.5}
                className={`p-1 text-xs rounded cursor-pointer ${
                  (!pdfDocument || scale >= 1.5)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-500 text-white cursor-pointer hover:bg-gray-600'
                }`}
                whileHover={(pdfDocument && scale < 1.5) ? { scale: 1.05 } : {}}
                whileTap={(pdfDocument && scale < 1.5) ? { scale: 0.95 } : {}}
              >
                <FiPlus className="w-5 h-5" />
              </motion.button>
              {}
              {totalPages > 0 && (
                <motion.div
                  className="flex items-center px-2 py-1 rounded bg-blue-500 text-white text-xs font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <FiBookOpen className="w-5 h-5 mr-1" />
                  <span className="whitespace-nowrap">
                    Page {currentPage} / {totalPages}
                  </span>
                </motion.div>
              )}
              <motion.button
                onClick={() => pdfDocument && setIsAddingComment(!isAddingComment)}
                disabled={!pdfDocument}
                className={`p-1 text-xs rounded cursor-pointer ${
                  !pdfDocument
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isAddingComment
                    ? 'bg-indigo-500 text-white cursor-pointer hover:bg-indigo-600'
                    : 'bg-blue-500 text-white cursor-pointer hover:bg-blue-600'
                }`}
                whileHover={pdfDocument ? { scale: 1.05 } : {}}
                whileTap={pdfDocument ? { scale: 0.95 } : {}}
              >
                <div className="flex items-center space-x-1">
                  <FiMessageCircle className="w-5 h-5" />
                  {!isMobile && <span>{isAddingComment ? 'Cancel' : 'Comment'}</span>}
                </div>
              </motion.button>
            </div>
            <div className="flex items-center space-x-1">
              <motion.button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className={`p-1 text-xs rounded cursor-pointer ${
                  currentPage <= 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-500 text-white cursor-pointer hover:bg-gray-600'
                }`}
                whileHover={currentPage > 1 ? { scale: 1.05 } : {}}
                whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
              >
                <FiChevronLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={`p-1 text-xs rounded cursor-pointer ${
                  currentPage >= totalPages
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-500 text-white cursor-pointer hover:bg-gray-600'
                }`}
                whileHover={currentPage < totalPages ? { scale: 1.05 } : {}}
                whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}
              >
                <FiChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
          <div
            ref={pdfContainerRef}
            className="flex-1 overflow-auto bg-gray-100 custom-scrollbar"
            style={{
              height: isMobile ? `calc(100vh - ${bottomPanelHeight + 130}px)` : 'auto',
              touchAction: scale > 1.0 ? 'pan-x pan-y' : 'pan-x pan-y',
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth',
              overflowX: 'auto',
              overflowY: 'auto',
              ...(isMobile ? {
                minHeight: `calc(100vh - ${bottomPanelHeight + 130}px)`,
                paddingBottom: scale > 1.3 ? '40px' : fitToWidth ? '60px' : '50px'
              } : {})
            }}
          >
            <div className={`${
              isMobile
                ? scale > 1.3
                  ? 'p-4 pb-8'
                  : fitToWidth
                  ? 'p-2 pb-12'
                  : 'p-2 pb-10'
                : 'p-2 md:p-4'
            } min-h-full flex ${isMobile ? 'justify-start' : 'justify-center'} items-start overflow-visible`}>
              <div
                className="relative bg-white shadow-lg"
                style={{
                  display: 'inline-block',
                  minWidth: 'auto',
                  cursor: scale > 1.5 ? 'grab' : 'default',
                  touchAction: 'none',
                  userSelect: 'none'
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {pdfLoading ? (
                  <div className="w-full min-h-[300px] md:min-h-[600px] flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 md:h-12 w-8 md:w-12 border-b-2 border-transparent border-t-4 border-t-blue-600 mx-auto mb-4"></div>
                      <div className="bg-gray-200 h-2 w-48 mx-auto mb-4 rounded-full overflow-hidden loading-shimmer"></div>
                      <p className="text-gray-700 font-medium mb-2 text-sm md:text-base">Loading PDF...</p>
                      <p className="text-xs md:text-sm text-gray-500">This may take a few moments</p>
                    </div>
                  </div>
                ) : pdfError ? (
                  <div className="w-full min-h-[300px] md:min-h-[600px] flex items-center justify-center bg-gray-50">
                    <div className="text-center max-w-md mx-auto px-6">
                      <div className="text-red-500 mb-4 md:mb-6 flex justify-center">
                        <FiX className="w-12 h-12 md:w-16 md:h-16" />
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-red-600 mb-3">Error Loading PDF</h3>
                      <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">{pdfError}</p>
                      <div className="space-y-3">
                        <motion.button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full btn-primary px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <FiUpload className="w-4 h-4" />
                            <span>Try Different File</span>
                          </div>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                ) : pdfDocument ? (
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      className="block"
                      style={{
                        maxWidth: 'none',
                        minWidth: 'auto',
                        display: 'block'
                      }}
                    />
                    <div
                      ref={overlayRef}
                      className="absolute inset-0 cursor-crosshair"
                      onClick={handleCanvasClick}
                    >
                      {currentPageComments.map((comment) => (
                        <div
                          key={comment.id}
                          className="absolute group comment-marker"
                          style={{
                            left: `${comment.x}%`,
                            top: `${comment.y}%`,
                            transform: 'translate(-50%, -50%)'
                          }}
                        >
                          <div
                            className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-all ${
                              selectedComment === comment.id
                                ? 'bg-blue-600 text-white shadow-lg scale-110 ring-2 ring-blue-200'
                                : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 shadow-md'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedComment(selectedComment === comment.id ? null : comment.id)
                            }}
                          >
                            {currentPageComments.findIndex(c => c.id === comment.id) + 1}
                          </div>
                          {selectedComment === comment.id && (
                            <div
                              className="fixed bg-white rounded-lg shadow-xl border border-slate-200 p-3 z-[60] comment-overlay"
                              style={{
                                width: isMobile ? 'min(85vw, 16rem)' : '15rem',
                                maxWidth: isMobile ? '85vw' : '15rem',
                                ...((() => {
                                  if (!overlayRef.current || !isMobile) {
                                    return {
                                      position: 'absolute',
                                      top: comment.y > 50 ? 'auto' : '100%',
                                      bottom: comment.y > 50 ? '100%' : 'auto',
                                      left: comment.x < 25 ? '100%' : comment.x > 75 ? 'auto' : '50%',
                                      right: comment.x > 75 ? '100%' : 'auto',
                                      transform: comment.x < 25 || comment.x > 75 ?
                                        (comment.y > 50 ? 'translateY(calc(-100% + 8px))' : 'translateY(-8px)') :
                                        (comment.y > 50 ? 'translate(-50%, calc(-100% + 8px))' : 'translate(-50%, -8px)'),
                                      marginLeft: comment.x < 25 ? '8px' : '0px',
                                      marginRight: comment.x > 75 ? '8px' : '0px'
                                    }
                                  }
                                  const overlay = overlayRef.current.getBoundingClientRect()
                                  const commentAbsX = overlay.left + (comment.x / 100) * overlay.width
                                  const commentAbsY = overlay.top + (comment.y / 100) * overlay.height
                                  const boxWidth = Math.min(window.innerWidth * 0.85, 256)
                                  const boxHeight = 120
                                  const margin = 16
                                  let left = commentAbsX - boxWidth / 2
                                  let top = commentAbsY - boxHeight - margin
                                  if (left < margin) left = margin
                                  if (left + boxWidth > window.innerWidth - margin) {
                                    left = window.innerWidth - margin - boxWidth
                                  }
                                  if (top < margin) {
                                    top = commentAbsY + margin + 24
                                  }
                                  if (top + boxHeight > window.innerHeight - margin) {
                                    top = Math.max(margin, commentAbsY - boxHeight - margin)
                                  }
                                  return {
                                    left: `${left}px`,
                                    top: `${top}px`,
                                    transform: 'none'
                                  }
                                })())
                              }}
                            >
                              <div className="text-sm text-slate-800 mb-3 break-words">{comment.text}</div>
                              <div className="flex justify-between items-center text-xs gap-2">
                                <span className="text-slate-500 font-medium truncate flex-1">{comment.timestamp.toLocaleString()}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteComment(comment.id)
                                  }}
                                  className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-red-600 transition-all duration-200 cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                              <div
                                className="absolute w-0 h-0"
                                style={{
                                  ...(comment.y < 30 ? {
                                    bottom: '100%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    borderLeft: '6px solid transparent',
                                    borderRight: '6px solid transparent',
                                    borderBottom: '6px solid white'
                                  } : comment.y > 70 ? {
                                    top: '100%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    borderLeft: '6px solid transparent',
                                    borderRight: '6px solid transparent',
                                    borderTop: '6px solid white'
                                  } : comment.x < 30 ? {
                                    top: '50%',
                                    right: '100%',
                                    transform: 'translateY(-50%)',
                                    borderTop: '6px solid transparent',
                                    borderBottom: '6px solid transparent',
                                    borderRight: '6px solid white'
                                  } : comment.x > 70 ? {
                                    top: '50%',
                                    left: '100%',
                                    transform: 'translateY(-50%)',
                                    borderTop: '6px solid transparent',
                                    borderBottom: '6px solid transparent',
                                    borderLeft: '6px solid white'
                                  } : {
                                    top: '100%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    borderLeft: '6px solid transparent',
                                    borderRight: '6px solid transparent',
                                    borderTop: '6px solid white'
                                  })
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                      {isAddingComment && tempComment.x > 0 && (
                        <div
                          className="fixed comment-overlay z-[70] bg-black/20 backdrop-blur-sm inset-0 flex items-center justify-center p-4"
                          onClick={(e) => {
                            if (e.target === e.currentTarget) {
                              setIsAddingComment(false)
                              setTempComment({ x: 0, y: 0, text: '' })
                            }
                          }}
                        >
                          <div
                            className="bg-white rounded-lg shadow-xl border border-slate-300 p-4 w-full max-w-sm mx-auto"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="mb-3">
                              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center space-x-2">
                                <FiMessageCircle className="w-4 h-4 text-blue-600" />
                                <span>Add Comment</span>
                              </label>
                              <textarea
                                autoFocus
                                placeholder="Enter your comment..."
                                className="w-full p-3 border border-slate-300 rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                                rows={3}
                                value={tempComment.text}
                                onChange={(e) => setTempComment(prev => ({ ...prev, text: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    addComment(tempComment.text)
                                  } else if (e.key === 'Escape') {
                                    setIsAddingComment(false)
                                    setTempComment({ x: 0, y: 0, text: '' })
                                  }
                                }}
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setIsAddingComment(false)
                                  setTempComment({ x: 0, y: 0, text: '' })
                                }}
                                className="px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all duration-200 font-medium cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => addComment(tempComment.text)}
                                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200 font-medium cursor-pointer"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedComment && (
                        <div
                          className="fixed comment-overlay z-[60] bg-black/20 backdrop-blur-sm inset-0 flex items-center justify-center p-4"
                          onClick={(e) => {
                            if (e.target === e.currentTarget) {
                              setSelectedComment(null)
                            }
                          }}
                        >
                          <div
                            className="bg-white rounded-lg shadow-xl border border-slate-300 p-4 w-full max-w-sm mx-auto"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {(() => {
                              const comment = comments.find(c => c.id === selectedComment)
                              if (!comment) return null
                              return (
                                <>
                                  <div className="mb-4">
                                    <div className="flex items-center justify-between mb-3">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                          {comments.filter(c => c.page === comment.page).findIndex(c => c.id === comment.id) + 1}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700">Comment</span>
                                      </div>
                                      <button
                                        onClick={() => setSelectedComment(null)}
                                        className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                      >
                                        <FiX className="w-5 h-5" />
                                      </button>
                                    </div>
                                    <div className="text-sm text-slate-800 break-words p-3 bg-slate-50 rounded-md border">
                                      {comment.text}
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center text-xs gap-2">
                                    <span className="text-slate-500 font-medium">
                                      {comment.timestamp.toLocaleString()}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        deleteComment(comment.id)
                                      }}
                                      className="bg-red-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-red-600 transition-all duration-200 flex items-center space-x-1 cursor-pointer"
                                    >
                                      <FiX className="w-3 h-3" />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                </>
                              )
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-full min-h-[300px] md:min-h-[550px] flex items-center justify-center bg-white">
                    <div className="text-center max-w-md mx-auto px-6">
                      <div className="text-blue-500 mb-4 md:mb-6 flex justify-center">
                        <FiFileText className="w-12 h-12 md:w-16 md:h-16" />
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-3">No PDF Loaded</h3>
                      <p className="text-gray-600 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">Upload a PDF file to get started with your peer review</p>
                      <div>
                        <motion.button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full btn-primary px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <FiUpload className="w-4 h-4" />
                            <span>Upload PDF</span>
                          </div>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {!isMobile && (
          <div className="w-96 bg-white overflow-y-auto custom-scrollbar border-l border-slate-200">
            <div className="p-6 space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                      <FiEdit3 className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span>Peer Review</span>
                  </h2>
                  <div className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                    {comments.length} comment{comments.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 font-medium">Progress</span>
                    <span className="text-blue-600 font-semibold">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <motion.div
                      className="bg-blue-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center mt-0.5">
                    <HiOutlineLightBulb className="w-3 h-3 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800 text-sm mb-1">Instructions</h3>
                    <p className="text-sm text-slate-600">
                      {pdfDocument ? 'Evaluate the research paper using the criteria below' : 'Upload a PDF file to start the peer review process'}
                    </p>
                  </div>
                </div>
              </div>
              <div className={`space-y-6 ${!pdfDocument ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                    <FiStar className="w-6 h-6 text-slate-600" />
                    <h3 className="font-semibold text-slate-800">Rating Criteria</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                      <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center space-x-2">
                        <FiEdit3 className="w-4 h-4 text-blue-600" />
                        <span>Clarity & Presentation</span>
                      </label>
                      <StarRating
                        value={reviewData.clarity}
                        onChange={(value) => updateReviewData('clarity', value)}
                      />
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                      <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center space-x-2">
                        <MdScience className="w-4 h-4 text-green-600" />
                        <span>Methodology & Approach</span>
                      </label>
                      <StarRating
                        value={reviewData.methodology}
                        onChange={(value) => updateReviewData('methodology', value)}
                      />
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                      <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center space-x-2">
                        <FiTrendingUp className="w-4 h-4 text-purple-600" />
                        <span>Significance & Impact</span>
                      </label>
                      <StarRating
                        value={reviewData.significance}
                        onChange={(value) => updateReviewData('significance', value)}
                      />
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                      <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center space-x-2">
                        <HiOutlineLightBulb className="w-4 h-4 text-amber-600" />
                        <span>Originality & Novelty</span>
                      </label>
                      <StarRating
                        value={reviewData.originality}
                        onChange={(value) => updateReviewData('originality', value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                    <FiEdit3 className="w-4 h-4 text-slate-600" />
                    <h3 className="font-semibold text-slate-800">Written Feedback</h3>
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-lg">
                    <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <FiTrendingUp className="w-4 h-4 text-green-600" />
                        <span>Strengths</span>
                      </span>
                      <span className="text-xs text-slate-500">
                        {countWords(reviewData.strengths)}/{MAX_WORDS.strengths} words
                      </span>
                    </label>
                    <textarea
                      className={`w-full p-3 border rounded-lg text-sm resize-none focus:ring-2 transition-all duration-200 bg-white ${
                        validationErrors.strengths
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      rows={3}
                      placeholder="What are the main strengths of this work?"
                      value={reviewData.strengths}
                      onChange={(e) => {
                        e.preventDefault()
                        updateReviewData('strengths', e.target.value)
                      }}
                    />
                    {validationErrors.strengths && (
                      <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                        <FiX className="w-4 h-4" />
                        <span>{validationErrors.strengths}</span>
                      </p>
                    )}
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-lg">
                    <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <FiEye className="w-4 h-4 text-slate-600" />
                        <span>Weaknesses</span>
                      </span>
                      <span className="text-xs text-slate-500">
                        {countWords(reviewData.weaknesses)}/{MAX_WORDS.weaknesses} words
                      </span>
                    </label>
                    <textarea
                      className={`w-full p-3 border rounded-lg text-sm resize-none focus:ring-2 transition-all duration-200 bg-white ${
                        validationErrors.weaknesses
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      rows={3}
                      placeholder="What areas need improvement?"
                      value={reviewData.weaknesses}
                      onChange={(e) => {
                        e.preventDefault()
                        updateReviewData('weaknesses', e.target.value)
                      }}
                    />
                    {validationErrors.weaknesses && (
                      <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                        <FiX className="w-4 h-4" />
                        <span>{validationErrors.weaknesses}</span>
                      </p>
                    )}
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-lg">
                    <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <HiOutlineLightBulb className="w-4 h-4 text-blue-600" />
                        <span>Recommendations</span>
                      </span>
                      <span className="text-xs text-slate-500">
                        {countWords(reviewData.recommendations)}/{MAX_WORDS.recommendations} words
                      </span>
                    </label>
                    <textarea
                      className={`w-full p-3 border rounded-lg text-sm resize-none focus:ring-2 transition-all duration-200 bg-white ${
                        validationErrors.recommendations
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      rows={3}
                      placeholder="What specific changes do you recommend?"
                      value={reviewData.recommendations}
                      onChange={(e) => {
                        e.preventDefault()
                        updateReviewData('recommendations', e.target.value)
                      }}
                    />
                    {validationErrors.recommendations && (
                      <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                        <FiX className="w-4 h-4" />
                        <span>{validationErrors.recommendations}</span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                    <FiAward className="w-4 h-4 text-slate-600" />
                    <h3 className="font-semibold text-slate-800">Overall Assessment</h3>
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-lg">
                    <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center space-x-2">
                      <FiStar className="w-4 h-4 text-yellow-600" />
                      <span>Overall Rating</span>
                    </label>
                    <StarRating
                      value={reviewData.overallRating}
                      onChange={(value) => updateReviewData('overallRating', value)}
                    />
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-lg">
                    <label className="block text-sm font-medium text-slate-700 mb-4">
                      <span className="flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <FiTarget className="w-4 h-4 text-indigo-600" />
                          <span>Confidence Level</span>
                        </span>
                        <span className="text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded text-sm">
                          {reviewData.confidenceLevel}%
                        </span>
                      </span>
                    </label>
                    <div className="relative mb-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={reviewData.confidenceLevel}
                        onChange={(e) => updateReviewData('confidenceLevel', parseInt(e.target.value))}
                        className="professional-slider w-full cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span>Low</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>High</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <motion.button
                    type="button"
                    className={`w-full py-3 rounded-lg font-medium text-base transition-all cursor-pointer ${
                      progress === 100 && !isSubmitting
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                        : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    }`}
                    onClick={progress === 100 && !isSubmitting ? handleSubmitReview : undefined}
                    disabled={progress < 100 || isSubmitting}
                    whileHover={progress === 100 && !isSubmitting ? { y: -1 } : {}}
                    whileTap={progress === 100 && !isSubmitting ? { scale: 0.99 } : {}}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {isSubmitting ? (
                        <>
                          <motion.div
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <span>Submitting...</span>
                        </>
                      ) : progress === 100 ? (
                        <>
                          <FiSend className="w-4 h-4" />
                          <span>Submit Review</span>
                        </>
                      ) : (
                        <>
                          <FiBookOpen className="w-4 h-4" />
                          <span>Complete All Fields ({progress}%)</span>
                        </>
                      )}
                    </div>
                  </motion.button>
                  {!isOnline && (
                    <div className="mt-2 text-center">
                      <p className="text-xs text-slate-500">Review will be saved offline and synced when online</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {isMobile && (
          <div
            ref={bottomPanelRef}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30 transition-all duration-300 shadow-lg"
            style={{ height: `${bottomPanelHeight}px` }}
            onTouchStart={handlePanelTouchStart}
            onTouchMove={handlePanelTouchMove}
            onTouchEnd={handlePanelTouchEnd}
          >
            <div
              className={`w-full py-2 bg-slate-50 border-b border-slate-200 flex justify-center items-center relative transition-colors duration-200 ${
                isPanelDragging
                  ? 'cursor-grabbing bg-slate-100'
                  : 'cursor-grab hover:bg-slate-100'
              }`}
              style={{
                touchAction: 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none'
              }}
            >
              <div className={`w-12 h-1 rounded-full transition-colors duration-200 ${
                isPanelDragging
                  ? 'bg-slate-400'
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}></div>
            </div>
            <motion.button
              onClick={() => {
                if (bottomPanelHeight <= 150) {
                  setBottomPanelHeight(window.innerHeight * 0.8)
                } else {
                  setBottomPanelHeight(80)
                }
              }}
              className="absolute right-4 -top-6 z-40 group cursor-pointer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              title={bottomPanelHeight <= 150 ? "Expand panel" : "Collapse panel"}
            >
              <div className="relative w-12 h-12 bg-white/95 backdrop-blur-xl rounded-full shadow-xl border border-white/30 transition-all duration-300 group-hover:shadow-2xl group-hover:bg-white">
                <div className="absolute inset-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full group-hover:from-blue-500/30 group-hover:to-indigo-500/30 transition-all duration-300"></div>
                <div className="relative w-full h-full flex items-center justify-center">
                  <motion.div
                    className="flex items-center justify-center text-slate-600 group-hover:text-blue-600"
                    animate={{
                      rotate: bottomPanelHeight <= 150 ? 0 : 180,
                    }}
                    transition={{
                      duration: 0.4,
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                  >
                    <FiChevronUp className="w-5 h-5" strokeWidth={2.5} />
                  </motion.div>
                </div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-indigo-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-indigo-400/20 blur-md opacity-0 group-hover:opacity-60 transition-all duration-300 -z-10"></div>
              </div>
            </motion.button>
            <div className="px-4 py-3 border-b border-slate-100 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                  <div className="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center">
                    <FiEdit3 className="w-3 h-3 text-white" />
                  </div>
                  <span>Peer Review</span>
                </h2>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-md border border-slate-200">{comments.length} comments</span>
                  {(offlineChanges > 0 || pendingSubmissions.length > 0) && (
                    <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-1 rounded-md border border-indigo-200">
                      {offlineChanges + pendingSubmissions.length} pending
                    </span>
                  )}
                  <span className="text-sm text-blue-600 font-semibold">{progress}%</span>
                </div>
              </div>
            </div>
            <div
              className={`mobile-panel-scroll flex-1 overflow-y-scroll px-4 py-4 space-y-4 bg-white ${!pdfDocument ? 'opacity-50 pointer-events-none' : ''}`}
              style={{
                maxHeight: `${bottomPanelHeight - 120}px`
              }}
            >
              {bottomPanelHeight > 150 && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <label className="block text-xs font-medium text-slate-700 mb-2 flex items-center space-x-1">
                        <FiEdit3 className="w-3 h-3 text-blue-600" />
                        <span>Clarity</span>
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => updateReviewData('clarity', star)}
                            className={`transition-colors cursor-pointer ${
                              star <= reviewData.clarity
                                ? 'text-yellow-400 hover:text-yellow-500'
                                : 'text-gray-300 hover:text-gray-400'
                            }`}
                            disabled={!pdfDocument}
                          >
                            <FiStar
                              className="w-6 h-6"
                              fill={star <= reviewData.clarity ? 'currentColor' : 'none'}
                              strokeWidth={2}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <label className="block text-xs font-medium text-slate-700 mb-2 flex items-center space-x-1">
                        <FiStar className="w-3 h-3 text-yellow-600" />
                        <span>Overall</span>
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => updateReviewData('overallRating', star)}
                            className={`transition-colors cursor-pointer ${
                              star <= reviewData.overallRating
                                ? 'text-yellow-400 hover:text-yellow-500'
                                : 'text-gray-300 hover:text-gray-400'
                            }`}
                            disabled={!pdfDocument}
                          >
                            <FiStar
                              className="w-6 h-6"
                              fill={star <= reviewData.overallRating ? 'currentColor' : 'none'}
                              strokeWidth={2}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <FiTrendingUp className="w-4 h-4 text-green-600" />
                          <span>Strengths</span>
                        </span>
                        <span className="text-xs text-slate-500">
                          {countWords(reviewData.strengths)}/{MAX_WORDS.strengths} words
                        </span>
                      </label>
                      <textarea
                        className={`w-full p-3 border rounded-lg text-sm resize-none focus:ring-2 transition-all duration-200 bg-white ${
                          validationErrors.strengths
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        rows={2}
                        placeholder="What are the main strengths?"
                        value={reviewData.strengths}
                        onChange={(e) => updateReviewData('strengths', e.target.value)}
                        disabled={!pdfDocument}
                      />
                      {validationErrors.strengths && (
                        <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                          <FiX className="w-3 h-3" />
                          <span>{validationErrors.strengths}</span>
                        </p>
                      )}
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <FiEye className="w-4 h-4 text-slate-600" />
                          <span>Weaknesses</span>
                        </span>
                        <span className="text-xs text-slate-500">
                          {countWords(reviewData.weaknesses)}/{MAX_WORDS.weaknesses} words
                        </span>
                      </label>
                      <textarea
                        className={`w-full p-3 border rounded-lg text-sm resize-none focus:ring-2 transition-all duration-200 bg-white ${
                          validationErrors.weaknesses
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        rows={2}
                        placeholder="What areas need improvement?"
                        value={reviewData.weaknesses}
                        onChange={(e) => updateReviewData('weaknesses', e.target.value)}
                        disabled={!pdfDocument}
                      />
                      {validationErrors.weaknesses && (
                        <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                          <FiX className="w-3 h-3" />
                          <span>{validationErrors.weaknesses}</span>
                        </p>
                      )}
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <HiOutlineLightBulb className="w-4 h-4 text-blue-600" />
                          <span>Recommendations</span>
                        </span>
                        <span className="text-xs text-slate-500">
                          {countWords(reviewData.recommendations)}/{MAX_WORDS.recommendations} words
                        </span>
                      </label>
                      <textarea
                        className={`w-full p-3 border rounded-lg text-sm resize-none focus:ring-2 transition-all duration-200 bg-white ${
                          validationErrors.recommendations
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        rows={2}
                        placeholder="What changes do you recommend?"
                        value={reviewData.recommendations}
                        onChange={(e) => updateReviewData('recommendations', e.target.value)}
                        disabled={!pdfDocument}
                      />
                      {validationErrors.recommendations && (
                        <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                          <FiX className="w-3 h-3" />
                          <span>{validationErrors.recommendations}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <label className="block text-xs font-medium text-slate-700 mb-2 flex items-center space-x-1">
                        <MdScience className="w-3 h-3 text-green-600" />
                        <span>Methodology</span>
                      </label>
                      <StarRating
                        value={reviewData.methodology}
                        onChange={(value) => updateReviewData('methodology', value)}
                      />
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <label className="block text-xs font-medium text-slate-700 mb-2 flex items-center space-x-1">
                        <FiTrendingUp className="w-3 h-3 text-purple-600" />
                        <span>Significance</span>
                      </label>
                      <StarRating
                        value={reviewData.significance}
                        onChange={(value) => updateReviewData('significance', value)}
                      />
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <label className="block text-xs font-medium text-slate-700 mb-2 flex items-center space-x-1">
                      <HiOutlineLightBulb className="w-3 h-3 text-amber-600" />
                      <span>Originality & Novelty</span>
                    </label>
                    <StarRating
                      value={reviewData.originality}
                      onChange={(value) => updateReviewData('originality', value)}
                    />
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      <span className="flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <FiTarget className="w-4 h-4 text-blue-600" />
                          <span>Confidence Level</span>
                        </span>
                        <span className="text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded text-sm">
                          {reviewData.confidenceLevel}%
                        </span>
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={reviewData.confidenceLevel}
                        onChange={(e) => updateReviewData('confidenceLevel', parseInt(e.target.value))}
                        className="professional-slider w-full cursor-pointer"
                        disabled={!pdfDocument}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1 font-medium">
                      <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span>Low</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>High</span>
                      </span>
                    </div>
                  </div>
                  <motion.button
                    type="button"
                    className={`w-full py-3 rounded-lg font-medium text-base transition-all shadow-sm cursor-pointer ${
                      progress === 100 && !isSubmitting
                        ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
                        : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    }`}
                    onClick={progress === 100 && !isSubmitting ? handleSubmitReview : undefined}
                    disabled={progress < 100 || isSubmitting}
                    whileHover={progress === 100 && !isSubmitting ? { y: -1 } : {}}
                    whileTap={progress === 100 && !isSubmitting ? { scale: 0.99 } : {}}
                  >
                     <div className="flex items-center justify-center space-x-2">
                        {isSubmitting ? (
                          <>
                            <motion.div
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <span>Submitting...</span>
                          </>
                        ) : progress === 100 ? (
                          <>
                            <FiSend className="w-4 h-4" />
                            <span>Submit Review</span>
                          </>
                        ) : (
                          <>
                            <FiBookOpen className="w-4 h-4" />
                            <span>{progress}% Complete</span>
                          </>
                        )}
                       </div>
                  </motion.button>
                  <div className="h-4"></div>
                </>
              )}
            </div>
            {bottomPanelHeight > 200 && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white via-slate-50 to-transparent pointer-events-none opacity-70"></div>
            )}
          </div>
        )}
        </div>
      </motion.div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        className="hidden"
      />
     </>
   )
 }
export default App