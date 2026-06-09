import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct, useUploadProductImage, useDeleteProductImage } from "../hooks/products";
import { ImageUploader, ImageGallery } from "../components/products";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useToast } from "@/hooks/useToast";
import { ArrowLeft, Upload } from "lucide-react";
import type { ImageUploadPayload } from "../types/product";

export const ProductImagesPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const productId = id ? parseInt(id) : 0;

  const { data: product, isLoading } = useProduct(productId);
  const uploadMutation = useUploadProductImage(productId);
  const deleteMutation = useDeleteProductImage(productId);

  const [isUploading, setIsUploading] = useState(false);

  const handleUploadImage = (payload: ImageUploadPayload) => {
    setIsUploading(true);
    uploadMutation.mutate(payload, {
      onSuccess: () => {
        toast({ title: "Success", description: "Image uploaded successfully" });
        setIsUploading(false);
      },
      onError: (error: any) => {
        toast({ 
          title: "Error", 
          description: error.response?.data?.message || "Failed to upload image", 
          variant: "destructive" 
        });
        setIsUploading(false);
      },
    });
  };

  const handleDeleteImage = (imageId: number) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      deleteMutation.mutate(imageId, {
        onSuccess: () => {
          toast({ title: "Success", description: "Image deleted successfully" });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to delete image", variant: "destructive" });
        },
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center py-8">Product not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/products/${productId}`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Manage Images</h1>
            <p className="text-sm text-gray-500">{product.name}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Images ({product.images?.length || 0}/10)</CardTitle>
            </CardHeader>
            <CardContent>
              {product.images && product.images.length > 0 ? (
                <ImageGallery
                  images={product.images}
                  productId={productId}
                  onDelete={handleDeleteImage}
                  showDeleteButton={true}
                />
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-2">No images uploaded yet</p>
                  <p className="text-sm text-gray-400">Upload images using the form on the right</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upload New Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                productId={productId}
                onUpload={handleUploadImage}
                isUploading={isUploading}
                maxImages={10}
                currentImageCount={product.images?.length || 0}
              />
              <div className="mt-4 space-y-2 text-sm text-gray-500">
                <p><strong>Accepted formats:</strong> JPG, PNG, WEBP</p>
                <p><strong>Max file size:</strong> 5MB</p>
                <p><strong>Max images:</strong> 10 per product</p>
                <p><strong>Recommended size:</strong> 800x800px or larger</p>
              </div>
            </CardContent>
          </Card>

          {product.images && product.images.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Image Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <p>Use high-quality images for better presentation</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <p>First image will be used as the main product image</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <p>Add alt text for better accessibility and SEO</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <p>Use consistent lighting and backgrounds</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
