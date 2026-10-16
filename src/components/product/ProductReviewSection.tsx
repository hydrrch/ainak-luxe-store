"use client";

import React, { useState } from "react";
import { Star, ShieldCheck, Check, MessageSquare, Send } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface Review {
  id: string;
  authorName: string;
  rating: number;
  title?: string | null;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: Date | string;
}

interface ProductReviewSectionProps {
  productId: string;
  initialReviews: Review[];
  rating: number;
  reviewCount: number;
}

export default function ProductReviewSection({
  productId,
  initialReviews,
  rating,
  reviewCount,
}: ProductReviewSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [authorName, setAuthorName] = useState(user?.name || "");
  const [ratingInput, setRatingInput] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg("Please write a comment for your review.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating: ratingInput,
          title: title.trim() || undefined,
          comment: comment.trim(),
          authorName: authorName.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to submit review.");
      } else {
        setReviews([data.review, ...reviews]);
        setSuccessMsg("Thank you! Your verified review has been submitted.");
        setShowForm(false);
        setTitle("");
        setComment("");
      }
    } catch {
      setErrorMsg("Network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header and Rating Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-luxury-dark tracking-tight">
            Customer Reviews ({reviews.length})
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex text-gold-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(rating)
                      ? "fill-gold-500 text-gold-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-900">{rating} out of 5</span>
            <span className="text-xs text-gray-400">({reviews.length} ratings)</span>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow transition-all self-start sm:self-auto"
        >
          {showForm ? "Cancel Review" : "Write a Review"}
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Review Submission Form */}
      {showForm && (
        <form
          onSubmit={handleSubmitReview}
          className="bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-4 max-w-xl animate-in fade-in-50"
        >
          <h4 className="font-bold text-sm text-gray-900">Share Your Experience</h4>

          {/* Star selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Your Rating:
            </label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRatingInput(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= ratingInput
                        ? "fill-gold-500 text-gold-500"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Tariq Mehmood"
              className="w-full p-2.5 border border-gray-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-brand-700"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Headline / Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Excellent frame fit and fast Karachi delivery"
              className="w-full p-2.5 border border-gray-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-brand-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Review Details
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="How do the frames fit? How is the optical lens quality?"
              className="w-full p-2.5 border border-gray-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-brand-700"
              required
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-xs text-gray-500 italic">No reviews yet. Be the first to review this frame!</p>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex text-gold-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold-500" />
                    ))}
                  </div>
                  {rev.title && (
                    <span className="font-bold text-xs text-gray-900">{rev.title}</span>
                  )}
                </div>
                <span className="text-[11px] text-gray-400">
                  {formatDate(rev.createdAt)}
                </span>
              </div>

              <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>

              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="font-semibold text-gray-900">{rev.authorName}</span>
                {rev.isVerifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified Buyer
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
