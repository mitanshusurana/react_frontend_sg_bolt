import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Upload, X, Plus, Image as ImageIcon } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import useGemstones from '../hooks/useGemstones';
import { Gemstone } from '../types';
import { uploadService } from '../services/uploadService';
import { Html5Qrcode } from 'html5-qrcode';

const GemstoneFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getGemstone, addGemstone, updateGemstone } = useGemstones();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const qrRegionId = 'qr-reader-region';

  const isEditMode = Boolean(id);
  const [initialValues, setInitialValues] = useState<Gemstone| null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getGemstone(id).then((data: Gemstone) => {
        setInitialValues(data);
        setLoading(false);
      });
    } else {
      setInitialValues({
        name: '', category: '', type: '', weight: 0,
        dimensions: { length: 0, width: 0, height: 0 },
        color: '', clarity: '', cut: '', origin: '',
        treatment: '', certification: '', acquisitionDate: '',
        acquisitionPrice: undefined, estimatedValue: undefined,
        seller: '', notes: '', tags: [], images: [], video: '',
        id: '', createdBy: '', lastEditedBy: '',
        qrCode: '',
        createdAt: '',
        updatedAt: '',
        auditTrail: [],
      });
      setLoading(false);
    }
  }, [id, getGemstone]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    category: Yup.string().required('Category is required'),
    type: Yup.string().required('Type is required'),
    weight: Yup.number().required('Weight is required').positive().min(0.01),
    dimensions: Yup.object().shape({
      length: Yup.number().required().positive(),
      width: Yup.number().required().positive(),
      height: Yup.number().required().positive(),
    }),
    color: Yup.string().required('Color is required'),
    clarity: Yup.string().required('Clarity is required'),
    cut: Yup.string().required('Cut is required'),
    origin: Yup.string().required('Origin is required'),
    acquisitionDate: Yup.string().required('Acquisition date is required'),
    acquisitionPrice: Yup.number().positive().nullable(),
    estimatedValue: Yup.number().positive().nullable(),
    tags: Yup.array().of(Yup.string()),
    id: Yup.string().required('Gemstone ID is required'),
  });

  const handleSubmit = async (values: Gemstone) => {
    try {
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        const uploadedImages = await uploadService.uploadMultipleFiles(selectedImages);
        const keptUrls = imagePreviewUrls.filter(url => initialValues?.images?.includes(url));
        imageUrls = [...keptUrls, ...uploadedImages];
      } else if (isEditMode && initialValues && imagePreviewUrls.length > 0) {
        imageUrls = imagePreviewUrls;
      } else {
        imageUrls = [];
      }

      let videoUrl: string = '';
      if (selectedVideo) {
        const uploadedVideo = await uploadService.uploadMultipleFiles([selectedVideo]);
        videoUrl = uploadedVideo[0] || '';
      } else if (isEditMode && initialValues && videoPreviewUrl) {
        videoUrl = videoPreviewUrl;
      }

      const gemstoneData = {
        ...values,
        images: imageUrls,
        video: videoUrl,
        lastEditedBy: initialValues?.lastEditedBy || '',
        auditTrail: initialValues?.auditTrail || [],
      };

      if (isEditMode && initialValues) {
        const updated = await updateGemstone(initialValues.id as string, gemstoneData);
        if (updated) {
          toast.success('Gemstone updated successfully');
          navigate(`/gemstone/${initialValues.id}`);
        }
      } else {
        const newGemstone = await addGemstone(gemstoneData);
        toast.success('Gemstone added successfully');
        navigate(`/gemstone/${newGemstone.id}`);
      }
    } catch (error) {
      toast.error('Failed to save gemstone');
      console.error('Error saving gemstone:', error);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages((prev) => [...prev, ...files]);
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedVideo(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach(URL.revokeObjectURL);
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    };
  }, [imagePreviewUrls, videoPreviewUrl]);

  useEffect(() => {
    if (isEditMode && initialValues && Array.isArray(initialValues.images)) {
      setImagePreviewUrls(initialValues.images);
    }
    if (isEditMode && initialValues && initialValues.video) {
      setVideoPreviewUrl(initialValues.video);
    }
  }, [isEditMode, initialValues]);

  if (loading || !initialValues) return <div>Loading...</div>;

  return (
    <div className="container-page">
      <Link to={isEditMode ? `/gemstone/${id}` : '/inventory'} className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        {isEditMode ? 'Back to Gemstone' : 'Back to Inventory'}
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">
          {isEditMode ? 'Edit Gemstone' : 'Add New Gemstone'}
        </h1>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting, setFieldValue, values }) => {
            const [qrScanner, setQrScanner] = useState<Html5Qrcode | null>(null);
            const [qrScannerRunning, setQrScannerRunning] = useState(false);
            const [showQrScanner, setShowQrScanner] = useState(false);

            const stopAndClearScanner = async () => {
              if (qrScanner) {
                try {
                  if (qrScannerRunning) await qrScanner.stop();
                  await qrScanner.clear();
                } catch (err) {
                  console.warn("Error stopping/clearing scanner", err);
                } finally {
                  setQrScanner(null);
                  setQrScannerRunning(false);
                }
              }
            };

            useEffect(() => {
              return () => {
                stopAndClearScanner();
              };
            }, []);

            useEffect(() => {
              if (showQrScanner && !qrScanner) {
                const region = document.getElementById(qrRegionId);
                if (region) {
                  const scanner = new Html5Qrcode(qrRegionId);
                  setQrScanner(scanner);
                  scanner
                    .start(
                      { facingMode: 'environment' },
                      { fps: 10, qrbox: 250 },
                      async (decodedText) => {
                        console.log('QR Detected:', decodedText);
                        setFieldValue('id', decodedText);
                        setShowQrScanner(false);
                        await stopAndClearScanner();
                      },
                      () => {}
                    )
                    .then(() => setQrScannerRunning(true))
                    .catch((err) => {
                      toast.error('QR Scan Error');
                      console.error(err);
                      setShowQrScanner(false);
                      setQrScanner(null);
                    });
                }
              }

              if (!showQrScanner && qrScanner && qrScannerRunning) {
                stopAndClearScanner();
              }
            }, [showQrScanner]);

            return (
              <Form className="space-y-8">
                {/* Basic Information */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-4">Basic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="form-label">Name</label>
                      <Field
                        type="text"
                        id="name"
                        name="name"
                        className="form-input"
                        placeholder="Enter gemstone name"
                      />
                      <ErrorMessage name="name" component="div" className="text-error-600 text-sm mt-1" />
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="form-label">Category</label>
                      <Field
                        as="select"
                        id="category"
                        name="category"
                        className="form-select"
                      >
                        <option value="">Select category</option>
                        <option value="Precious">Precious</option>
                        <option value="Semi-Precious">Semi-Precious</option>
                        <option value="Organic">Organic</option>
                        <option value="Synthetic">Synthetic</option>
                        <option value="Other">Other</option>
                      </Field>
                      <ErrorMessage name="category" component="div" className="text-error-600 text-sm mt-1" />
                    </div>
                    
                    <div>
                      <label htmlFor="type" className="form-label">Type</label>
                      <Field
                        as="select"
                        id="type"
                        name="type"
                        className="form-select"
                      >
                        <option value="">Select type</option>
                        <option value="Diamond">Diamond</option>
                        <option value="Ruby">Ruby</option>
                        <option value="Sapphire">Sapphire</option>
                        <option value="Emerald">Emerald</option>
                        <option value="Pearl">Pearl</option>
                        <option value="Other">Other</option>
                      </Field>
                      <ErrorMessage name="type" component="div" className="text-error-600 text-sm mt-1" />
                    </div>
                    
                    <div>
                      <label htmlFor="weight" className="form-label">Weight (carats)</label>
                      <Field
                        type="number"
                        id="weight"
                        name="weight"
                        className="form-input"
                        step="0.01"
                        min="0"
                      />
                      <ErrorMessage name="weight" component="div" className="text-error-600 text-sm mt-1" />
                    </div>
                  </div>
                </div>
                
                {/* Physical Characteristics */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-4">Physical Characteristics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="dimensions.length" className="form-label">Length (mm)</label>
                      <Field
                        type="number"
                        id="dimensions.length"
                        name="dimensions.length"
                        className="form-input"
                        step="0.01"
                        min="0"
                      />
                      <ErrorMessage name="dimensions.length" component="div" className="text-error-600 text-sm mt-1" />
                    </div>
                    
                    <div>
                      <label htmlFor="dimensions.width" className="form-label">Width (mm)</label>
                      <Field
                        type="number"
                        id="dimensions.width"
                        name="dimensions.width"
                        className="form-input"
                        step="0.01"
                        min="0"
                      />
                      <ErrorMessage name="dimensions.width" component="div" className="text-error-600 text-sm mt-1" />
                    </div>
                    
                    <div>
                      <label htmlFor="dimensions.height" className="form-label">Height (mm)</label>
                      <Field
                        type="number"
                        id="dimensions.height"
                        name="dimensions.height"
                        className="form-input"
                        step="0.01"
                        min="0"
                      />
                      <ErrorMessage name="dimensions.height" component="div" className="text-error-600 text-sm mt-1" />
                    </div>
                    
                    <div>
                      <label htmlFor="color" className="form-label">Color</label>
                      <Field
                        type="text"
                        id="color"
                        name="color"
                        className="form-input"
                        placeholder="Enter color"
                      />
                      <ErrorMessage name="color" component="div" className="text-error-600 text-sm mt-1" />
                    </div>
                    
                    <div>
                      <label htmlFor="clarity" className="form-label">Clarity</label>
                      <Field
                        type="text"
                        id="clarity"
                        name="clarity"
                        className="form-input"
                        placeholder="Enter clarity"
                      />
                      <ErrorMessage name="clarity" component="div" className="text-error-600 text-sm mt-1" />
                    </div>
                    
                    <div>
                      <label htmlFor="cut" className="form-label">Cut</label>
                      <Field
                        type="text"
                        id="cut"
                        name="cut"
                        className="form-input"
                        placeholder="Enter cut"
                      />
                      <ErrorMessage name="cut" component="div" className="text-error-600 text-sm mt-1" />
                    </div>
                  </div>
                </div>
                
                {/* Origin and Treatment */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-4">Origin and Treatment</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="origin" className="form-label">Origin</label>
                      <Field
                        type="text"
                        id="origin"
                        name="origin"
                        className="form-input"
                        placeholder="Enter origin"
                      />
                      <ErrorMessage name="origin" component="div" className="text-error-600 text-sm mt-1" />
                    </div>
                    
                    <div>
                      <label htmlFor="treatment" className="form-label">Treatment</label>
                      <Field
                        type="text"
                        id="treatment"
                        name="treatment"
                        className="form-input"
                        placeholder="Enter treatment"
                      />
                      <ErrorMessage name="treatment" component="div" className="text-error-600 text-sm mt-1" />
                    </div>
                    
                    <div>
                      <label htmlFor="certification" className="form-label">Certification</label>
                      <Field
                        type="text"
                        id="certification"
                        name="certification"
                        className="form-input"
                        placeholder="Enter certification number"
                      />
                      <ErrorMessage name="certification" component="div" className="text-error-600 text-sm mt-1" />
                    </div>
                  </div>
                </div>
                
                {/* Acquisition Details */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-4">Acquisition Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="acquisitionDate" className="form-label">Acquisition Date</label>
                      <Field
                        type="date"
                        id="acquisitionDate"
                        name="acquisitionDate"
                        className="form-input"
                      />
                      <ErrorMessage name="acquisitionDate" component="div" className="text-error-600 text-sm mt-1" />
                    </div>
                    
                    <div>
                      <label htmlFor="seller" className="form-label">Seller</label>
                      <Field
                        type="text"
                        id="seller"
                        name="seller"
                        className="form-input"
                        placeholder="Enter seller name"
                      />
                      <ErrorMessage name="seller" component="div" className="text-error-600 text-sm mt-1" />
                    </div>
                    
                    <div>
                      <label htmlFor="acquisitionPrice" className="form-label">Acquisition Price</label>
                      <Field
                        type="number"
                        id="acquisitionPrice"
                        name="acquisitionPrice"
                        className="form-input"
                        step="0.01"
                        min="0"
                        placeholder="Enter acquisition price"
                      />
                      <ErrorMessage name="acquisitionPrice" component="div" className="text-error-600 text-sm mt-1" />
                    </div>
                    
                    <div>
                      <label htmlFor="estimatedValue" className="form-label">Estimated Value</label>
                      <Field
                        type="number"
                        id="estimatedValue"
                        name="estimatedValue"
                        className="form-input"
                        step="0.01"
                        min="0"
                        placeholder="Enter estimated value"
                      />
                      <ErrorMessage name="estimatedValue" component="div" className="text-error-600 text-sm mt-1" />
                    </div>
                    
                    <div>
                      <label htmlFor="id" className="form-label">Gemstone ID</label>
                      <div className="flex items-center gap-2">
                        <Field
                          type="text"
                          id="id"
                          name="id"
                          className="form-input"
                          placeholder="Enter unique gemstone ID"
                        />
                        <button
                          type="button"
                          className="btn-outline"
                          onClick={() => setShowQrScanner((prev) => !prev)}
                          title="Scan QR"
                        >
                          <span role="img" aria-label="Scan QR">📷</span>
                        </button>
                      </div>
                      <ErrorMessage name="id" component="div" className="text-error-600 text-sm mt-1" />
                      {showQrScanner && (
                        <div className="mt-2">
                          <div id={qrRegionId} style={{ width: 300 }} />
                          <button
                            type="button"
                            className="btn-outline mt-2"
                            onClick={() => setShowQrScanner(false)}
                          >
                            Close Scanner
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Media Upload */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-4">Media</h2>
                  
                  {/* Image upload */}
                  <div className="mb-6">
                    <label className="form-label">Images</label>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative aspect-square">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
                              setSelectedImages(prev => prev.filter((_, i) => i !== index));
                            }}
                            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      
                      <label className="relative aspect-square border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary-500 transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageSelect}
                          className="sr-only"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500">
                          <ImageIcon className="h-8 w-8 mb-2" />
                          <span className="text-sm">Add Image</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  {/* Video upload */}
                  <div>
                    <label className="form-label">Video</label>
                    <div className="mt-2">
                      {videoPreviewUrl ? (
                        <div className="relative aspect-video">
                          <video
                            src={videoPreviewUrl}
                            controls
                            className="w-full h-full object-contain rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setVideoPreviewUrl('');
                              setSelectedVideo(null);
                            }}
                            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="relative aspect-video border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary-500 transition-colors cursor-pointer">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoSelect}
                            className="sr-only"
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500">
                            <Upload className="h-8 w-8 mb-2" />
                            <span className="text-sm">Upload Video</span>
                          </div>
                        </label>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Notes and Tags */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-4">Additional Information</h2>
                  
                  <div className="mb-6">
                    <label htmlFor="notes" className="form-label">Notes</label>
                    <Field
                      as="textarea"
                      id="notes"
                      name="notes"
                      rows={4}
                      className="form-input"
                      placeholder="Enter any additional notes about the gemstone"
                    />
                    <ErrorMessage name="notes" component="div" className="text-error-600 text-sm mt-1" />
                  </div>
                  
                  <div>
                    <label htmlFor="tags" className="form-label">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {values.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => {
                              const newTags = values.tags.filter((_, i) => i !== index);
                              setFieldValue('tags', newTags);
                            }}
                            className="ml-2 text-neutral-400 hover:text-neutral-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const tag = prompt('Enter a new tag:');
                          if (tag && !values.tags.includes(tag)) {
                            setFieldValue('tags', [...values.tags, tag]);
                          }
                        }}
                        className="bg-neutral-100 text-neutral-700 hover:bg-neutral-200 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Tag
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Form actions */}
                <div className="flex justify-end space-x-4">
                  <Link
                    to={isEditMode ? `/gemstone/${id}` : '/inventory'}
                    className="btn-outline"
                  >
                    Cancel
                  </Link>
                  
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this gemstone?')) {
                          // Handle delete
                        }
                      }}
                      className="btn bg-error-600 text-white hover:bg-error-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isEditMode ? 'Save Changes' : 'Add Gemstone'}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default GemstoneFormPage;