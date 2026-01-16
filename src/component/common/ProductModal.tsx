import React, { useState, useEffect } from "react";
import { X, Upload, Package, DollarSign, Tag, Hash } from "lucide-react";
import { apiCallPost, apiCallPatch } from "../../api/axios";
import { API_URLS } from "../../contants/constants";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: any;
  readOnly?: boolean;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  product,
  readOnly = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    initialStock: "",
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        category: product.category || "",
        brand: product.brand || "",
        initialStock: product.inventory?.quantity?.toString() || "0",
      });
      setPreviewUrl(product.images?.[0]?.imageUrl || null);
    } else {
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        brand: "",
        initialStock: "",
      });
      setPreviewUrl(null);
    }
    setImageFile(null);
  }, [product, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await apiCallPost(API_URLS.IMAGE_UPLOAD, formData);
      if (!res.error && res.data?.url) {
        return res.data.url;
      }
      return null;
    } catch (error) {
      console.error("Image upload failed", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    setLoading(true);

    const payload = {
      ...form,
      price: parseFloat(form.price),
      initialStock: parseInt(form.initialStock) || 0,
    };

    try {
      let productId = product?.id;
      let res;

      if (product) {
        res = await apiCallPatch(
          API_URLS.ADMIN_PRODUCT_DETAILS(product.id),
          payload
        );
      } else {
        res = await apiCallPost(API_URLS.ADMIN_PRODUCTS, payload);
        if (!res.error && res.data) {
          productId = res.data.id;
        }
      }

      if (!res.error) {
        // Handle Image Upload if new image selected
        if (imageFile && productId) {
          const imageUrl = await uploadImage(imageFile);
          if (imageUrl) {
            await apiCallPost(API_URLS.ADMIN_PRODUCT_IMAGES(productId), {
              imageUrl,
              isPrimary: true,
            });
          }
        }

        toast.success(product ? "Product updated" : "Product created");
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {product
                    ? readOnly
                      ? "Product Details"
                      : "Edit Product"
                    : "Add New Product"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {readOnly
                    ? "View product details."
                    : `Fill in the details to ${
                        product ? "update" : "list"
                      } your product.`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-slate-600 shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-8 space-y-6 max-h-[70vh] overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Upload Section */}
                <div className="md:col-span-2 flex justify-center">
                  <div
                    className={`relative group ${
                      !readOnly ? "cursor-pointer" : ""
                    }`}
                  >
                    <div
                      className={`w-32 h-32 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden ${
                        !readOnly
                          ? "hover:border-blue-500 transition-colors"
                          : ""
                      }`}
                    >
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <Upload
                            className="mx-auto text-slate-400 mb-2"
                            size={24}
                          />
                          <span className="text-xs text-slate-500">
                            {readOnly ? "No Image" : "Upload Image"}
                          </span>
                        </div>
                      )}
                    </div>
                    {!readOnly && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                    )}
                    {!readOnly && previewUrl && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none">
                        <span className="text-white text-xs font-bold">
                          Change
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Product Name
                  </label>
                  <div className="relative group">
                    <Package
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                      size={18}
                    />
                    <input
                      required
                      disabled={readOnly}
                      type="text"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder="e.g. iPhone 15 Pro Max"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Category
                  </label>
                  <div className="relative group">
                    <Tag
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                      size={18}
                    />
                    <select
                      required
                      disabled={readOnly}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all text-sm appearance-none disabled:opacity-60 disabled:cursor-not-allowed"
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                    >
                      <option value="">Select Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Home">Home</option>
                      <option value="Beauty">Beauty</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Brand
                  </label>
                  <div className="relative group">
                    <Hash
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                      size={18}
                    />
                    <input
                      required
                      disabled={readOnly}
                      type="text"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder="e.g. Apple"
                      value={form.brand}
                      onChange={(e) =>
                        setForm({ ...form, brand: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Price ($)
                  </label>
                  <div className="relative group">
                    <DollarSign
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                      size={18}
                    />
                    <input
                      required
                      disabled={readOnly}
                      type="number"
                      step="0.01"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder="0.00"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Initial Stock
                  </label>
                  <div className="relative group">
                    <Hash
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                      size={18}
                    />
                    <input
                      required
                      disabled={readOnly}
                      type="number"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder="0"
                      value={form.initialStock}
                      onChange={(e) =>
                        setForm({ ...form, initialStock: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Description
                  </label>
                  <textarea
                    required
                    disabled={readOnly}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all text-sm resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="Describe your product..."
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  {readOnly ? "Close" : "Cancel"}
                </button>
                {!readOnly && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Upload size={18} />
                        {product ? "Update Product" : "Create Product"}
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
