import { ChevronRight } from 'lucide-react'

type BreadcrumbItem = {
  label: string
  current?: boolean
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      {items.map((item, index) => (
        <span className="breadcrumb-node" key={item.label}>
          {index > 0 ? <ChevronRight aria-hidden="true" className="icon" /> : null}
          {item.current ? <strong>{item.label}</strong> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  )
}
