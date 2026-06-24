"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Upload, Eye, Download, Trash2, FileText, X, Loader2, AlertTriangle } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import { documentsApi, openDocumentFile } from '@/lib/api';
import { DOCUMENT_TYPES } from '@/lib/constants';

interface Document {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
  fileType: string;
  status: string;
  uploadedAt: string;
}

const DOC_TYPES = DOCUMENT_TYPES;

const STATUS_STYLE: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700',
  VERIFIED: 'bg-emerald-50 text-emerald-700',
  REJECTED: 'bg-red-50 text-red-600',
};
const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Menunggu', VERIFIED: 'Terverifikasi', REJECTED: 'Ditolak',
};

function UploadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!docName.trim()) { setError('Nama dokumen wajib diisi.'); return; }
    if (!docType) { setError('Jenis dokumen wajib dipilih.'); return; }
    if (!file) { setError('File wajib dipilih.'); return; }

    setUploading(true);
    try {
      const { data: sign } = await documentsApi.getCloudinarySign();

      const fd = new FormData();
      fd.append('file', file);
      fd.append('api_key', sign.apiKey);
      fd.append('timestamp', String(sign.timestamp));
      fd.append('signature', sign.signature);
      fd.append('folder', sign.folder);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${sign.cloudName}/raw/upload`,
        { method: 'POST', body: fd }
      );
      const uploaded = await res.json();
      if (!res.ok) throw new Error(uploaded.error?.message ?? 'Upload ke Cloudinary gagal');

      const fileType = file.type === 'application/pdf' ? 'PDF' : 'Gambar';
      await documentsApi.create({
        name: docName.trim(),
        type: docType,
        fileUrl: uploaded.secure_url,
        publicId: uploaded.public_id,
        fileType,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Gagal mengupload. Coba lagi.');
    } finally {
      setUploading(false);
    }
  };

  const inputCls = "px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm w-full";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100">
          <X className="w-4 h-4" />
        </button>
        <h2 className="text-lg font-bold text-slate-900 mb-5">Upload Dokumen</h2>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Nama Dokumen *</label>
            <input value={docName} onChange={e => setDocName(e.target.value)} placeholder="Contoh: NIB 2024" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Jenis Dokumen *</label>
            <select value={docType} onChange={e => setDocType(e.target.value)} className={inputCls}>
              <option value="">Pilih Jenis Dokumen</option>
              {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">File *</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
            >
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-slate-700 font-medium truncate max-w-[200px]">{file.name}</span>
                </div>
              ) : (
                <>
                  <Upload className="w-7 h-7 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-sm text-slate-500">Klik untuk pilih file</p>
                  <p className="text-xs text-slate-400 mt-0.5">PDF, JPG, PNG — maks 10MB</p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50">
              Batal
            </button>
            <GlowButton type="submit" variant="primary" disabled={uploading} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium">
              {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Mengupload...</> : <><Upload className="w-4 h-4" /> Upload</>}
            </GlowButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DokumenPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [fileError, setFileError] = useState('');

  const fetchDocs = () => {
    setLoading(true);
    documentsApi.list()
      .then(res => setDocs(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await documentsApi.delete(deleteId);
      setDeleteId(null);
      fetchDocs();
    } catch {
    } finally {
      setDeleting(false);
    }
  };

  const handleFileAction = async (doc: Document, download = false) => {
    setFileError('');
    try {
      await openDocumentFile(doc, download);
    } catch {
      setFileError('Gagal memuat file dokumen. Coba lagi beberapa saat.');
    }
  };

  return (
    <>
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={() => { setShowUpload(false); fetchDocs(); }}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Hapus Dokumen?</h2>
            <p className="text-sm text-slate-500 mb-5">Dokumen akan dihapus permanen dan tidak bisa dipulihkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50">
                Batal
              </button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium disabled:opacity-50">
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dokumen Saya</h1>
          <p className="text-slate-500 mt-1">Kelola dokumen legalitas dan sertifikasi usaha</p>
        </div>
        <GlowButton variant="primary" onClick={() => setShowUpload(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium">
          <Upload className="w-4 h-4" /> Upload Dokumen
        </GlowButton>
      </div>

      {loading ? (
        <GlassCard className="p-12 flex items-center justify-center text-slate-400">Memuat dokumen...</GlassCard>
      ) : docs.length === 0 ? (
        <GlassCard className="p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
          <FileText className="w-10 h-10 text-slate-300" />
          <p className="text-sm">Belum ada dokumen yang diupload.</p>
          <GlowButton variant="primary" onClick={() => setShowUpload(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium mt-1">
            <Upload className="w-4 h-4" /> Upload Dokumen Pertama
          </GlowButton>
        </GlassCard>
      ) : (
        <div className="flex flex-col gap-4">
          {fileError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {fileError}
            </div>
          )}
          {docs.map(doc => (
            <GlassCard key={doc.id} className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                <FileText className={`w-5 h-5 ${doc.fileType === 'PDF' ? 'text-red-500' : 'text-blue-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate">{doc.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {doc.type} • {doc.fileType} • Diupload: {new Date(doc.uploadedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${STATUS_STYLE[doc.status] ?? 'bg-slate-100 text-slate-600'}`}>
                {STATUS_LABEL[doc.status] ?? doc.status}
              </span>
              <button onClick={() => handleFileAction(doc)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg transition-colors">
                <Eye className="w-4 h-4" />
              </button>
              <button onClick={() => handleFileAction(doc, true)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
              </button>
              <button onClick={() => setDeleteId(doc.id)} className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </GlassCard>
          ))}
        </div>
      )}
    </>
  );
}
