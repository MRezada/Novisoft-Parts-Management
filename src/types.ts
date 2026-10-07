export type PartStatus = 'موجود' | 'کمبود' | 'ناموجود'

export type PartGroup = {
  id: number
  code: string
  name: string
  description?: string
}

export type Subgroup = {
  id: number
  groupId: number
  code: string
  name: string
  description?: string
}

export type Part = {
  id: string
  code: string
  name: string
  groupId: number
  subgroupId: number
  group: string
  subgroup: string
  unit: string
  stock: number
  min: number
  location: string
  status: PartStatus
}
