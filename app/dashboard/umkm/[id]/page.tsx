import { UMKMProfilePage } from '@/features/dashboard/umkm-profile-page'

export default async function UMKMProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UMKMProfilePage id={id} />
}
