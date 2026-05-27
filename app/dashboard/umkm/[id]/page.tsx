import { UMKMProfilePage } from '@/features/dashboard/umkm-profile-page'

export default function UMKMProfile({ params }: { params: { id: string } }) {
  return <UMKMProfilePage id={params.id} />
}
