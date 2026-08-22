import { UMKMProfilePage } from '@/features/dashboard/umkm-profile-page'

// Backend menolak (403) kalau UMKM ini di luar wilayah admin yang membuka.
export default async function RegionalUMKMProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UMKMProfilePage id={id} basePath="/regional" />
}
