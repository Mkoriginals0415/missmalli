import React from "react";

/**
 * Reusable Product Card Skeleton
 * Exactly mirrors the real product card dimensions & 2:3 aspect ratio
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white/90 backdrop-blur-xs rounded-[24px] sm:rounded-[28px] overflow-hidden border border-brand-lilac/30 shadow-xs flex flex-col justify-between p-3 sm:p-4 animate-pulse">
      {/* Saree Image Placeholder */}
      <div className="relative aspect-[2/3] w-full rounded-[18px] sm:rounded-[20px] bg-brand-deepPlum/[0.06] overflow-hidden mb-3.5">
        {/* Subtle Badge Placeholder */}
        <div className="absolute top-2.5 left-2.5 w-16 h-5 rounded-full bg-brand-deepPlum/[0.08]" />
      </div>

      {/* Text Meta Lines */}
      <div className="space-y-2">
        <div className="h-3 w-1/3 rounded-full bg-brand-deepPlum/[0.08]" />
        <div className="h-4 w-4/5 rounded-full bg-brand-deepPlum/[0.12]" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-5 w-20 rounded-full bg-brand-deepPlum/[0.10]" />
          <div className="h-3 w-10 rounded-full bg-brand-deepPlum/[0.08]" />
        </div>
      </div>
    </div>
  );
}

/**
 * Product Listing Page Skeleton
 */
export function ProductListingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2 max-w-md animate-pulse">
        <div className="h-4 w-24 rounded-full bg-brand-deepPlum/[0.08]" />
        <div className="h-8 w-3/4 rounded-xl bg-brand-deepPlum/[0.12]" />
        <div className="h-3.5 w-full rounded-full bg-brand-deepPlum/[0.06]" />
      </div>

      {/* Filter Pills Skeleton */}
      <div className="flex items-center gap-2 overflow-x-hidden py-1 animate-pulse">
        {[80, 100, 70, 90, 85].map((w, i) => (
          <div
            key={i}
            className="h-8 rounded-full bg-brand-deepPlum/[0.07] shrink-0"
            style={{ width: `${w}px` }}
          />
        ))}
      </div>

      {/* Grid of Product Skeletons */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Product Detail Page Skeleton
 */
export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-pulse">
        {/* Left Column: Image Skeleton */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative aspect-[2/3] max-h-[72vh] w-full rounded-[28px] bg-brand-deepPlum/[0.06] border border-brand-lilac/30 shadow-xs" />
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-16 sm:w-20 aspect-[2/3] rounded-[16px] bg-brand-deepPlum/[0.06] border border-brand-lilac/20"
              />
            ))}
          </div>
        </div>

        {/* Right Column: Details Skeleton */}
        <div className="lg:col-span-5 space-y-6 pt-2">
          <div className="space-y-3">
            <div className="h-4 w-28 rounded-full bg-brand-deepPlum/[0.08]" />
            <div className="h-9 w-4/5 rounded-2xl bg-brand-deepPlum/[0.14]" />
            <div className="h-4 w-1/2 rounded-full bg-brand-deepPlum/[0.08]" />
          </div>

          <div className="h-10 w-36 rounded-2xl bg-brand-deepPlum/[0.10]" />

          <div className="p-5 rounded-[22px] bg-white/70 border border-brand-lilac/30 space-y-3">
            <div className="h-4 w-1/3 rounded-full bg-brand-deepPlum/[0.08]" />
            <div className="h-3.5 w-full rounded-full bg-brand-deepPlum/[0.06]" />
            <div className="h-3.5 w-4/5 rounded-full bg-brand-deepPlum/[0.06]" />
          </div>

          <div className="h-14 w-full rounded-full bg-brand-deepPlum/[0.12]" />
        </div>
      </div>
    </div>
  );
}
