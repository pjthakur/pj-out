"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { FaUser, FaBuilding, FaBox, FaFileAlt, FaShare, FaEye, FaCamera, FaFolder, FaFile, FaInstagram, FaFacebook, FaTwitter, FaPinterest, FaTiktok, FaCheckCircle, FaEnvelope, FaBriefcase, FaLightbulb, FaInfoCircle, FaSave, FaUpload, FaChevronDown } from "react-icons/fa" 

// Types
interface FormData {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
  }
  businessInfo: {
    businessName: string
    businessType: string
    description: string
    website: string
    yearsInBusiness: string
  }
  productInfo: {
    categories: string[]
    productName: string
    productDescription: string
    price: string
    materials: string
    productImages: File[]
  }
  documents: {
    businessLicense: File | null
    taxId: File | null
    insurance: File | null
  }
  socialMedia: {
    instagram: string
    facebook: string
    twitter: string
    pinterest: string
    tiktok: string
  }
}

const initialFormData: FormData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  },
  businessInfo: {
    businessName: "",
    businessType: "",
    description: "",
    website: "",
    yearsInBusiness: "",
  },
  productInfo: {
    categories: [],
    productName: "",
    productDescription: "",
    price: "",
    materials: "",
    productImages: [],
  },
  documents: {
    businessLicense: null,
    taxId: null,
    insurance: null,
  },
  socialMedia: {
    instagram: "",
    facebook: "",
    twitter: "",
    tiktok: "",
    pinterest: "",
  },
}

//Dropdown 
function CustomDropdown({
  options,
  value,
  onChange,
  placeholder,
  error,
  label,
  required = false,
}: {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder: string
  error?: string
  label: string
  required?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="mb-3 sm:mb-4" ref={dropdownRef}>
      <label className="block text-xs sm:text-sm font-semibold text-[#504B38] mb-1.5 sm:mb-2 montserrat-semibold">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/90 backdrop-blur-sm border ${
            error ? "border-red-500 shadow-red-100" : "border-[#504B38]/20 hover:border-[#504B38]/30"
          } focus:outline-none focus:ring-2 focus:ring-[#504B38]/50 focus:border-[#504B38] transition-all duration-200 text-left flex justify-between items-center montserrat-medium text-sm sm:text-base shadow-sm`}
        >
          <span className={`${value ? "text-[#504B38]" : "text-[#504B38]/50"}`}>{value || placeholder}</span>
          <FaChevronDown
            className={`text-[#504B38]/70 transition-transform duration-200 text-xs sm:text-sm ${isOpen ? "transform rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-20 mt-1 w-full bg-white/95 backdrop-blur-md border border-[#504B38]/20 rounded-xl shadow-xl max-h-48 sm:max-h-60 overflow-auto">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => {
                  onChange(option)
                  setIsOpen(false)
                }}
                className={`p-2.5 sm:p-3 cursor-pointer hover:bg-[#F8F3D9] transition-colors duration-150 montserrat-medium text-sm sm:text-base first:rounded-t-xl last:rounded-b-xl ${
                  option === value ? "bg-[#F8F3D9] text-[#504B38] font-semibold" : "text-[#504B38]/80"
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs sm:text-sm mt-1.5 montserrat-medium flex items-center">
        <span className="mr-1">⚠️</span>{error}
      </p>}
    </div>
  )
}

// Form Input
function FormInput({
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required = false,
  multiline = false,
  rows = 3,
}: {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  required?: boolean
  multiline?: boolean
  rows?: number
}) {
  const inputClasses = `w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/90 backdrop-blur-sm border ${
    error ? "border-red-500 shadow-red-100" : "border-[#504B38]/20 hover:border-[#504B38]/30"
  } focus:outline-none focus:ring-2 focus:ring-[#504B38]/50 focus:border-[#504B38] transition-all duration-200 text-[#504B38] placeholder-[#504B38]/50 montserrat-medium text-sm sm:text-base shadow-sm`

  return (
    <div className="mb-3 sm:mb-4">
      <label className="block text-xs sm:text-sm font-semibold text-[#504B38] mb-1.5 sm:mb-2 montserrat-semibold">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={inputClasses}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
      {error && <p className="text-red-500 text-xs sm:text-sm mt-1.5 montserrat-medium flex items-center">
        <span className="mr-1">⚠️</span>{error}
      </p>}
    </div>
  )
}

// Progress Indicator Component
function ProgressIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex justify-center">
      <div className="flex items-center space-x-1 sm:space-x-1.5">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`h-1 sm:h-1.5 w-8 sm:w-10 rounded-full transition-all duration-300 ${
                index <= currentStep 
                  ? "bg-gradient-to-r from-[#504B38] to-[#6B6247] shadow-lg" 
                  : "bg-[#B9B28A]/40"
              }`}
            />
            {index < totalSteps - 1 && (
              <div className="h-0.5 w-2 sm:w-3 bg-[#B9B28A]/30 mx-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Navigation Buttons
function NavigationButtons({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
}: {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
}) {
  return (
    <div className="flex justify-between gap-3 sm:gap-4">
      <button
        onClick={onPrevious}
        disabled={currentStep === 0}
        className={`flex-1 py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold transition-all duration-200 montserrat-semibold text-sm sm:text-base ${
          currentStep === 0
            ? "bg-[#EBE5C2]/60 text-[#504B38]/40 cursor-not-allowed"
            : "bg-white/90 backdrop-blur-sm text-[#504B38] hover:bg-white hover:shadow-md active:scale-95 border border-[#504B38]/20 hover:border-[#504B38]/30"
        }`}
      >
        Previous
      </button>

      {currentStep === totalSteps - 1 ? (
        <button
          onClick={onSubmit}
          className="flex-1 py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold bg-gradient-to-r from-[#504B38] to-[#6B6247] text-white hover:from-[#5A5142] hover:to-[#75694D] active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl montserrat-semibold text-sm sm:text-base"
        >
          Submit Application
        </button>
      ) : (
        <button
          onClick={onNext}
          className="flex-1 py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold bg-gradient-to-r from-[#504B38] to-[#6B6247] text-white hover:from-[#5A5142] hover:to-[#75694D] active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl montserrat-semibold text-sm sm:text-base"
        >
          Next
        </button>
      )}
    </div>
  )
}

// Product Preview
function ProductPreview({ formData }: { formData: FormData }) {
  const { productInfo } = formData

  if (!productInfo.productName && !productInfo.productDescription && productInfo.productImages.length === 0) {
    return null
  }

  return (
    <div className="mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#504B38]/20">
      <h3 className="text-lg font-semibold text-[#504B38] mb-4 flex items-center montserrat-semibold">
        <FaEye className="mr-2" />
        Live Preview
      </h3>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="aspect-square bg-[#F8F3D9] rounded-lg mb-4 overflow-hidden">
          {productInfo.productImages.length > 0 ? (
            <img
              src={URL.createObjectURL(productInfo.productImages[0]) || "/placeholder.svg"}
              alt="Product preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#504B38]/60">
              <div className="text-center">
                <FaCamera className="text-4xl mb-2 mx-auto" />
                <p className="text-sm montserrat-regular">No image uploaded</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-[#504B38] montserrat-semibold">
            {productInfo.productName || "Product Name"}
          </h4>

          {productInfo.price && (
            <p className="text-xl font-bold text-[#504B38] montserrat-bold">${productInfo.price}</p>
          )}

          {productInfo.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {productInfo.categories.map((category) => (
                <span
                  key={category}
                  className="px-2 py-1 bg-[#EBE5C2] text-[#504B38] text-xs rounded-full montserrat-regular"
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          {productInfo.productDescription && (
            <p className="text-sm text-[#504B38]/80 line-clamp-3 montserrat-regular">
              {productInfo.productDescription}
            </p>
          )}

          {productInfo.materials && (
            <p className="text-xs text-[#504B38]/60 montserrat-regular">Materials: {productInfo.materials}</p>
          )}
        </div>
      </div>
    </div>
  )
}

// Personal Info
function PersonalInfoStep({
  formData,
  updateFormData,
  errors,
}: {
  formData: FormData
  updateFormData: (section: keyof FormData, data: any) => void
  errors: Record<string, string>
}) {
  const handleChange = (field: string, value: string) => {
    updateFormData("personalInfo", { [field]: value })
  }

  return (
    <div className="space-y-2 sm:space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <FormInput
          label="First Name"
          value={formData.personalInfo.firstName}
          onChange={(value) => handleChange("firstName", value)}
          error={errors.firstName}
          placeholder="John"
          required
        />
        <FormInput
          label="Last Name"
          value={formData.personalInfo.lastName}
          onChange={(value) => handleChange("lastName", value)}
          error={errors.lastName}
          placeholder="Doe"
          required
        />
      </div>

      <FormInput
        label="Email"
        type="email"
        value={formData.personalInfo.email}
        onChange={(value) => handleChange("email", value)}
        error={errors.email}
        placeholder="john@example.com"
        required
      />

      <FormInput
        label="Phone"
        type="tel"
        value={formData.personalInfo.phone}
        onChange={(value) => handleChange("phone", value)}
        error={errors.phone}
        placeholder="+1 (555) 123-4567"
        required
      />

      <FormInput
        label="Address"
        value={formData.personalInfo.address}
        onChange={(value) => handleChange("address", value)}
        placeholder="123 Main Street"
      />

      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <FormInput
          label="City"
          value={formData.personalInfo.city}
          onChange={(value) => handleChange("city", value)}
          placeholder="New York"
        />
        <FormInput
          label="State"
          value={formData.personalInfo.state}
          onChange={(value) => handleChange("state", value)}
          placeholder="NY"
        />
      </div>

      <FormInput
        label="Zip Code"
        value={formData.personalInfo.zipCode}
        onChange={(value) => handleChange("zipCode", value)}
        placeholder="10001"
      />
    </div>
  )
}

// Business Info Step
function BusinessInfoStep({
  formData,
  updateFormData,
  errors,
}: {
  formData: FormData
  updateFormData: (section: keyof FormData, data: any) => void
  errors: Record<string, string>
}) {
  const handleChange = (field: string, value: string) => {
    updateFormData("businessInfo", { [field]: value })
  }

  const businessTypes = ["Sole Proprietorship", "LLC", "Corporation", "Partnership", "Other"]

  return (
    <div className="space-y-2 sm:space-y-4">
      <FormInput
        label="Business Name"
        value={formData.businessInfo.businessName}
        onChange={(value) => handleChange("businessName", value)}
        error={errors.businessName}
        placeholder="Artisan Crafts Co."
        required
      />

      <CustomDropdown
        label="Business Type"
        options={businessTypes}
        value={formData.businessInfo.businessType}
        onChange={(value) => handleChange("businessType", value)}
        placeholder="Select business type"
        error={errors.businessType}
        required
      />

      <FormInput
        label="Business Description"
        value={formData.businessInfo.description}
        onChange={(value) => handleChange("description", value)}
        error={errors.description}
        placeholder="Tell us about your business and what makes it special..."
        multiline
        rows={3}
        required
      />

      <FormInput
        label="Website"
        type="url"
        value={formData.businessInfo.website}
        onChange={(value) => handleChange("website", value)}
        placeholder="https://www.yourwebsite.com"
      />

      <FormInput
        label="Years in Business"
        type="number"
        value={formData.businessInfo.yearsInBusiness}
        onChange={(value) => handleChange("yearsInBusiness", value)}
        placeholder="5"
      />
    </div>
  )
}

// Product Info Step
function ProductInfoStep({
  formData,
  updateFormData,
  errors,
}: {
  formData: FormData
  updateFormData: (section: keyof FormData, data: any) => void
  errors: Record<string, string>
}) {
  const [dragActive, setDragActive] = useState(false)

  const categories = [
    "Jewelry",
    "Clothing",
    "Home Decor",
    "Art",
    "Pottery",
    "Woodworking",
    "Textiles",
    "Candles",
    "Soap",
    "Leather Goods",
    "Paper Crafts",
    "Other",
  ]

  const handleChange = (field: string, value: any) => {
    updateFormData("productInfo", { [field]: value })
  }

  const handleCategoryToggle = (category: string) => {
    const currentCategories = formData.productInfo.categories
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter((c) => c !== category)
      : [...currentCategories, category]
    handleChange("categories", newCategories)
  }

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files)
      const currentFiles = formData.productInfo.productImages
      const updatedFiles = [...currentFiles, ...newFiles].slice(0, 5)
      handleChange("productImages", updatedFiles)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const removeImage = (index: number) => {
    const updatedImages = formData.productInfo.productImages.filter((_, i) => i !== index)
    handleChange("productImages", updatedImages)
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#504B38] mb-3 montserrat-medium">
          Product Categories <span className="text-red-600">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryToggle(category)}
              className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 montserrat-medium ${
                formData.productInfo.categories.includes(category)
                  ? "bg-[#504B38] text-white shadow-lg"
                  : "bg-white/80 backdrop-blur-sm text-[#504B38] hover:bg-white/90 border border-[#504B38]/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        {errors.categories && <p className="text-red-600 text-sm mt-1 montserrat-regular">{errors.categories}</p>}
      </div>

      <FormInput
        label="Product Name"
        value={formData.productInfo.productName}
        onChange={(value) => handleChange("productName", value)}
        error={errors.productName}
        placeholder="Handcrafted Ceramic Mug"
        required
      />

      <FormInput
        label="Product Description"
        value={formData.productInfo.productDescription}
        onChange={(value) => handleChange("productDescription", value)}
        error={errors.productDescription}
        placeholder="Describe your product in detail..."
        multiline
        rows={4}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Price"
          type="number"
          value={formData.productInfo.price}
          onChange={(value) => handleChange("price", value)}
          error={errors.price}
          placeholder="29.99"
          required
        />
        <FormInput
          label="Materials"
          value={formData.productInfo.materials}
          onChange={(value) => handleChange("materials", value)}
          placeholder="Ceramic, Glaze"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#504B38] mb-3 montserrat-medium">
          Product Images (Max 5)
        </label>
        <div
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 ${
            dragActive ? "border-[#504B38] bg-[#F8F3D9]" : "border-[#504B38]/30 bg-white/60 backdrop-blur-sm"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <FaUpload className="text-4xl mb-2 mx-auto text-[#504B38]" />
            <p className="text-[#504B38] mb-2 montserrat-medium">Drag & drop images here or click to browse</p>
            <p className="text-sm text-[#504B38]/60 montserrat-regular">PNG, JPG up to 10MB each</p>
          </label>
        </div>

        {formData.productInfo.productImages.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {formData.productInfo.productImages.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                  alt={`Product ${index + 1}`}
                  className="w-full h-24 object-cover rounded-xl"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs hover:bg-red-700 transition-colors montserrat-medium"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProductPreview formData={formData} />
    </div>
  )
}

// Documents Step
function DocumentsStep({
  formData,
  updateFormData,
}: {
  formData: FormData
  updateFormData: (section: keyof FormData, data: any) => void
  errors: Record<string, string>
}) {
  const [dragActive, setDragActive] = useState<string | null>(null)

  const handleFileUpload = (field: string, file: File | null) => {
    updateFormData("documents", { [field]: file })
  }

  const handleDrag = (e: React.DragEvent, field: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(field)
    } else if (e.type === "dragleave") {
      setDragActive(null)
    }
  }

  const handleDrop = (e: React.DragEvent, field: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(null)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(field, files[0])
    }
  }

  const DocumentUpload = ({
    field,
    label,
    description,
    required = false,
  }: {
    field: keyof FormData["documents"]
    label: string
    description: string
    required?: boolean
  }) => {
    const file = formData.documents[field]
    const isActive = dragActive === field

    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#504B38] mb-2 montserrat-medium">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
        <p className="text-sm text-[#504B38]/70 mb-3 montserrat-regular">{description}</p>

        <div
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 ${
            isActive ? "border-[#504B38] bg-[#F8F3D9]" : "border-[#504B38]/30 bg-white/60 backdrop-blur-sm"
          }`}
          onDragEnter={(e) => handleDrag(e, field)}
          onDragLeave={(e) => handleDrag(e, field)}
          onDragOver={(e) => handleDrag(e, field)}
          onDrop={(e) => handleDrop(e, field)}
        >
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload(field, e.target.files?.[0] || null)}
            className="hidden"
            id={`${field}-upload`}
          />
          <label htmlFor={`${field}-upload`} className="cursor-pointer">
            {file ? (
              <div>
                <FaFile className="text-4xl mb-2 mx-auto text-[#504B38]" />
                <p className="text-[#504B38] font-medium montserrat-medium">{file.name}</p>
                <p className="text-sm text-[#504B38]/60 montserrat-regular">Click to replace</p>
              </div>
            ) : (
              <div>
                <FaFolder className="text-4xl mb-2 mx-auto text-[#504B38]" />
                <p className="text-[#504B38] mb-2 montserrat-medium">Drag & drop file here or click to browse</p>
                <p className="text-sm text-[#504B38]/60 montserrat-regular">PDF, JPG, PNG up to 10MB</p>
              </div>
            )}
          </label>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#F8F3D9] border border-[#EBE5C2] rounded-2xl p-4 mb-6">
        <div className="flex items-start">
          <FaInfoCircle className="text-2xl mr-3 text-[#504B38]" />
          <div>
            <h3 className="font-medium text-[#504B38] mb-1 montserrat-medium">Document Requirements</h3>
            <p className="text-sm text-[#504B38]/80 montserrat-regular">
              Upload clear, legible documents. All documents should be current and valid.
            </p>
          </div>
        </div>
      </div>

      <DocumentUpload
        field="businessLicense"
        label="Business License"
        description="Upload your business license or registration certificate"
        required
      />

      <DocumentUpload
        field="taxId"
        label="Tax ID / EIN"
        description="Upload your tax identification document"
        required
      />

      <DocumentUpload
        field="insurance"
        label="Insurance Certificate"
        description="Upload your business insurance certificate (optional but recommended)"
      />
    </div>
  )
}

// Social Media Step
function SocialMediaStep({
  formData,
  updateFormData,
}: {
  formData: FormData
  updateFormData: (section: keyof FormData, data: any) => void
  errors: Record<string, string>
}) {
  const handleChange = (field: string, value: string) => {
    updateFormData("socialMedia", { [field]: value })
  }

  const socialPlatforms = [
    {
      name: "instagram",
      label: "Instagram",
      icon: FaInstagram,
      placeholder: "@yourusername",
      color: "text-pink-600",
    },
    {
      name: "facebook",
      label: "Facebook",
      icon: FaFacebook,
      placeholder: "facebook.com/yourpage",
      color: "text-blue-600",
    },
    {
      name: "twitter",
      label: "Twitter/X",
      icon: FaTwitter,
      placeholder: "@yourusername",
      color: "text-blue-400",
    },
    {
      name: "pinterest",
      label: "Pinterest",
      icon: FaPinterest,
      placeholder: "pinterest.com/yourprofile",
      color: "text-red-600",
    },
    {
      name: "tiktok",
      label: "TikTok",
      icon: FaTiktok,
      placeholder: "@yourusername",
      color: "text-black",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-[#504B38] mb-2 montserrat-semibold">Connect Your Social Media</h3>
        <p className="text-[#504B38]/70 text-sm montserrat-regular">
          Link your social accounts to help customers discover your brand
        </p>
      </div>

      <div className="space-y-4">
        {socialPlatforms.map((platform) => {
          const IconComponent = platform.icon
          return (
            <div key={platform.name} className="relative">
              <div className="flex items-center mb-2">
                <IconComponent className={`text-xl mr-2 ${platform.color}`} />
                <label className="text-sm font-medium text-[#504B38] montserrat-medium">{platform.label}</label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.socialMedia[platform.name as keyof typeof formData.socialMedia]}
                  onChange={(e) => handleChange(platform.name, e.target.value)}
                  placeholder={platform.placeholder}
                  className="w-full p-4 pl-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#504B38]/20 focus:outline-none focus:ring-2 focus:ring-[#504B38] focus:border-transparent transition-all duration-200 text-[#504B38] placeholder-[#504B38]/50 montserrat-medium"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <IconComponent className={`text-lg ${platform.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-[#F8F3D9] border border-[#EBE5C2] rounded-2xl p-4">
        <div className="flex items-start">
          <FaLightbulb className="text-2xl mr-3 text-[#504B38]" />
          <div>
            <h3 className="font-medium text-[#504B38] mb-1 montserrat-medium">Pro Tip</h3>
            <p className="text-sm text-[#504B38]/80 montserrat-regular">
              Active social media presence can increase your sales by up to 40%. Make sure your profiles showcase your
              best work!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Review Step Component
function ReviewStep({ formData }: { formData: FormData }) {
  // Format address to handle missing fields gracefully
  const formatAddress = () => {
    const { address, city, state, zipCode } = formData.personalInfo
    const parts = [address, city, state, zipCode].filter((part) => part.trim() !== "")
    return parts.length > 0 ? parts.join(", ") : "Not provided"
  }

  const InfoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-[#504B38] mb-3 border-b border-[#EBE5C2] pb-2 montserrat-semibold">
        {title}
      </h3>
      {children}
    </div>
  )

  const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex py-2 border-b border-[#EBE5C2]/50 last:border-b-0">
      <span className="text-[#504B38]/70 text-sm flex-shrink-0 w-1/3 montserrat-regular">{label}:</span>
      <span className="text-[#504B38] text-sm font-medium ml-auto break-words w-2/3 text-right montserrat-medium">
        {value || "Not provided"}
      </span>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-[#504B38] mb-2 montserrat-bold">Review Your Application</h3>
        <p className="text-[#504B38]/70 text-sm montserrat-regular">Please review all information before submitting</p>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-6 pr-2">
        <InfoSection title="Personal Information">
          <InfoRow label="Name" value={`${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`} />
          <InfoRow label="Email" value={formData.personalInfo.email} />
          <InfoRow label="Phone" value={formData.personalInfo.phone} />
          <InfoRow label="Address" value={formatAddress()} />
        </InfoSection>

        <InfoSection title="Business Information">
          <InfoRow label="Business Name" value={formData.businessInfo.businessName} />
          <InfoRow label="Business Type" value={formData.businessInfo.businessType} />
          <InfoRow label="Description" value={formData.businessInfo.description} />
          <InfoRow label="Website" value={formData.businessInfo.website} />
          <InfoRow label="Years in Business" value={formData.businessInfo.yearsInBusiness} />
        </InfoSection>

        <InfoSection title="Product Information">
          <InfoRow label="Categories" value={formData.productInfo.categories.join(", ")} />
          <InfoRow label="Product Name" value={formData.productInfo.productName} />
          <InfoRow label="Price" value={`$${formData.productInfo.price}`} />
          <InfoRow label="Materials" value={formData.productInfo.materials} />
          <InfoRow label="Images Uploaded" value={formData.productInfo.productImages.length.toString()} />
        </InfoSection>

        <InfoSection title="Documents">
          <InfoRow
            label="Business License"
            value={formData.documents.businessLicense ? "✅ Uploaded" : "❌ Not uploaded"}
          />
          <InfoRow label="Tax ID" value={formData.documents.taxId ? "✅ Uploaded" : "❌ Not uploaded"} />
          <InfoRow label="Insurance" value={formData.documents.insurance ? "✅ Uploaded" : "❌ Not uploaded"} />
        </InfoSection>

        <InfoSection title="Social Media">
          {Object.entries(formData.socialMedia).map(([platform, value]) => (
            <InfoRow
              key={platform}
              label={platform.charAt(0).toUpperCase() + platform.slice(1)}
              value={value || "Not connected"}
            />
          ))}
        </InfoSection>
      </div>

      <div className="bg-[#F8F3D9] border border-[#EBE5C2] rounded-2xl p-4">
        <div className="flex items-start">
          <FaCheckCircle className="text-2xl mr-3 text-green-600" />
          <div>
            <h3 className="font-medium text-[#504B38] mb-1 montserrat-medium">Ready to Submit!</h3>
            <p className="text-sm text-[#504B38]/80 montserrat-regular">
              Your application looks complete. We'll review it within 2-3 business days and get back to you via email.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Success Page Component
function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#F8F3D9] via-[#EBE5C2] to-[#B9B28A]">
      <div className="max-w-md w-full text-center">
        <div className="backdrop-blur-lg bg-white/60 rounded-3xl p-8 shadow-xl border border-white/40">
          <FaCheckCircle className="text-6xl mb-6 mx-auto text-green-600" />
          <h1 className="text-3xl font-bold text-[#504B38] mb-4 montserrat-bold">Application Submitted!</h1>
          <p className="text-[#504B38]/80 mb-6 montserrat-regular">
            Thank you for your application to join our marketplace. We've received all your information and will review
            it carefully.
          </p>

          <div className="bg-[#F8F3D9] border border-[#EBE5C2] rounded-2xl p-4 mb-6">
            <div className="flex items-start">
              <FaEnvelope className="text-2xl mr-3 text-[#504B38]" />
              <div className="text-left">
                <h3 className="font-medium text-[#504B38] mb-1 montserrat-medium">What's Next?</h3>
                <p className="text-sm text-[#504B38]/80 montserrat-regular">
                  We'll review your application within 2-3 business days and get back to you via email with the next
                  steps.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#EBE5C2] border border-[#B9B28A] rounded-2xl p-4">
            <div className="flex items-start">
              <FaBriefcase className="text-2xl mr-3 text-[#504B38]" />
              <div className="text-left">
                <h3 className="font-medium text-[#504B38] mb-1 montserrat-medium">In the Meantime</h3>
                <p className="text-sm text-[#504B38]/80 montserrat-regular">
                  Start preparing your product photos and descriptions. High-quality images can increase sales by up to
                  60%!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Component
export default function VendorOnboardingApp() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const steps = [
    { title: "Personal Info", component: PersonalInfoStep, icon: FaUser },
    { title: "Business Info", component: BusinessInfoStep, icon: FaBuilding },
    { title: "Product Info", component: ProductInfoStep, icon: FaBox },
    { title: "Documents", component: DocumentsStep, icon: FaFileAlt },
    { title: "Social Media", component: SocialMediaStep, icon: FaShare },
    { title: "Review", component: ReviewStep, icon: FaCheckCircle },
  ]

  // Save draft functionality
  useEffect(() => {
    const savedData = localStorage.getItem("vendorOnboardingDraft")
    if (savedData) {
      setFormData(JSON.parse(savedData))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("vendorOnboardingDraft", JSON.stringify(formData))
  }, [formData])

  // Touch gesture handling
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentStep < steps.length - 1) {
      handleNext()
    }
    if (isRightSwipe && currentStep > 0) {
      handlePrevious()
    }
  }

  const updateFormData = (section: keyof FormData, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }))
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 0: // Personal Info
        if (!formData.personalInfo.firstName) newErrors.firstName = "First name is required"
        if (!formData.personalInfo.lastName) newErrors.lastName = "Last name is required"
        if (!formData.personalInfo.email) newErrors.email = "Email is required"
        if (!formData.personalInfo.phone) newErrors.phone = "Phone is required"
        break
      case 1: // Business Info
        if (!formData.businessInfo.businessName) newErrors.businessName = "Business name is required"
        if (!formData.businessInfo.businessType) newErrors.businessType = "Business type is required"
        if (!formData.businessInfo.description) newErrors.description = "Description is required"
        break
      case 2: // Product Info
        if (!formData.productInfo.productName) newErrors.productName = "Product name is required"
        if (!formData.productInfo.productDescription) newErrors.productDescription = "Product description is required"
        if (!formData.productInfo.price) newErrors.price = "Price is required"
        if (formData.productInfo.categories.length === 0) newErrors.categories = "At least one category is required"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = () => {
    console.log("Form submitted:", formData)
    localStorage.removeItem("vendorOnboardingDraft")
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return <SuccessPage />
  }

  const CurrentStepComponent = steps[currentStep].component
  const CurrentStepIcon = steps[currentStep].icon

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
        
        .montserrat-thin {
          font-family: "Montserrat", sans-serif;
          font-optical-sizing: auto;
          font-weight: 100;
          font-style: normal;
        }
        
        .montserrat-extralight {
          font-family: "Montserrat", sans-serif;
          font-optical-sizing: auto;
          font-weight: 200;
          font-style: normal;
        }
        
        .montserrat-light {
          font-family: "Montserrat", sans-serif;
          font-optical-sizing: auto;
          font-weight: 300;
          font-style: normal;
        }
        
        .montserrat-regular {
          font-family: "Montserrat", sans-serif;
          font-optical-sizing: auto;
          font-weight: 400;
          font-style: normal;
        }
        
        .montserrat-medium {
          font-family: "Montserrat", sans-serif;
          font-optical-sizing: auto;
          font-weight: 500;
          font-style: normal;
        }
        
        .montserrat-semibold {
          font-family: "Montserrat", sans-serif;
          font-optical-sizing: auto;
          font-weight: 600;
          font-style: normal;
        }
        
        .montserrat-bold {
          font-family: "Montserrat", sans-serif;
          font-optical-sizing: auto;
          font-weight: 700;
          font-style: normal;
        }
        
        .montserrat-extrabold {
          font-family: "Montserrat", sans-serif;
          font-optical-sizing: auto;
          font-weight: 800;
          font-style: normal;
        }
        
        .montserrat-black {
          font-family: "Montserrat", sans-serif;
          font-optical-sizing: auto;
          font-weight: 900;
          font-style: normal;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        ::-webkit-scrollbar {
          width: 0px;
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
        
        @media (max-width: 768px) {
          button,
          input,
          select,
          textarea {
            min-height: 44px;
          }
          
          ::-webkit-scrollbar {
            width: 0px;
            background: transparent;
          }
        }
        
        * {
          -webkit-tap-highlight-color: transparent;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* Internet Explorer 10+ */
        }
        
        *::-webkit-scrollbar {
          width: 0px;
          background: transparent; /* Chrome/Safari/Webkit */
        }
        
        button {
          touch-action: manipulation;
        }
        
        /* Smooth scrolling for mobile */
        .overflow-y-auto {
          -webkit-overflow-scrolling: touch;
        }
        
        /* Focus styles for better accessibility */
        input:focus,
        textarea:focus,
        button:focus {
          outline: 2px solid rgba(80, 75, 56, 0.3);
          outline-offset: 2px;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-[#F8F3D9] via-[#EBE5C2] to-[#B9B28A]">
        {/* Header */} 
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-[#504B38]/20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-2 sm:py-4">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-[#504B38] montserrat-bold">tCOM</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="min-h-screen flex flex-col pt-12 sm:pt-16 md:pt-20 lg:pt-24 p-2 sm:p-4 md:p-8">
          <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
            {/* Header */}
            <div className="text-center mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#504B38] mb-2 sm:mb-3 montserrat-bold">Join Our Marketplace</h1>
              <p className="text-sm sm:text-base text-[#504B38]/70 montserrat-medium">Start selling your handmade goods today</p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-4 sm:mb-6">
              <ProgressIndicator currentStep={currentStep} totalSteps={steps.length} />
            </div>

            {/* Form Container */}
            <div
              ref={containerRef}
              className="flex-1 backdrop-blur-lg bg-white/60 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-xl border border-white/70 mb-4 sm:mb-6 overflow-hidden"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center mb-3">
                  <CurrentStepIcon className="text-lg sm:text-xl text-[#504B38] mr-2.5" />
                  <h2 className="text-lg sm:text-xl font-bold text-[#504B38] montserrat-bold">
                    {steps[currentStep].title}
                  </h2>
                </div>
                <div className="w-full bg-[#EBE5C2]/60 rounded-full h-1.5 sm:h-2">
                  <div
                    className="bg-gradient-to-r from-[#504B38] to-[#6B6247] h-full rounded-full transition-all duration-500 ease-out shadow-sm"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[calc(100vh-280px)] sm:max-h-none">
                <CurrentStepComponent formData={formData} updateFormData={updateFormData} errors={errors} />
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-auto pb-2">
              <NavigationButtons
                currentStep={currentStep}
                totalSteps={steps.length}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onSubmit={handleSubmit}
              />

              {/* Draft Save Indicator */}
              <div className="text-center mt-3 sm:mt-4">
                <p className="text-xs sm:text-sm text-[#504B38]/60 montserrat-medium flex items-center justify-center">
                  <FaSave className="mr-1.5 sm:mr-2 text-xs sm:text-sm animate-pulse" />
                  Your progress is automatically saved
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}